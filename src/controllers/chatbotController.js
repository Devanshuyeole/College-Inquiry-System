import Query from '../models/Query.js';
import Analytics from '../models/Analytics.js';

// Helper function to detect category
const detectCategory = (response) => {
  const categories = {
    'fees': ['Fee Structure', '₹', 'Tuition', 'cost'],
    'hostel': ['Hostel', 'accommodation', 'residence'],
    'placement': ['Placement', 'package', 'recruiter'],
    'courses': ['Programs', 'B.Tech', 'M.Tech', 'MBA'],
    'admission': ['Admission', 'Application', 'eligibility'],
    'facilities': ['Facilities', 'library', 'lab', 'sports'],
    'contact': ['Contact', 'Phone', 'Email', 'Address'],
    'departments': ['Departments', 'branch', 'Engineering']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => response.includes(keyword))) {
      return category;
    }
  }

  return 'general';
};

// Helper function to update analytics
const updateAnalytics = async (category) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Analytics.findOneAndUpdate(
      { date: today },
      {
        $inc: {
          totalQueries: 1
        },
        $addToSet: {
          popularCategories: { category, count: 1 }
        }
      },
      {
        upsert: true,
        new: true
      }
    );
  } catch (error) {
    console.error('Error updating analytics:', error);
  }
};

// Save Query - FIXED VERSION
export const saveQuery = async (req, res) => {
  try {
    // DEBUG: Log entire request body
    console.log('📥 Received request body:', JSON.stringify(req.body, null, 2));
    
    const { sessionId, userName, userEmail, userQuery, botResponse, timestamp } = req.body;

    // DEBUG: Log extracted values
    console.log('👤 userName:', userName);
    console.log('📧 userEmail:', userEmail);

    // Validate required fields
    if (!sessionId || !userQuery || !botResponse) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: sessionId, userQuery, botResponse' 
      });
    }

    // Detect category from response
    const category = detectCategory(botResponse);

    const newQuery = new Query({
      sessionId,
      userName: userName || 'Anonymous',      // NOW SAVING userName
      userEmail: userEmail || '',             // NOW SAVING userEmail
      userQuery,
      botResponse,
      timestamp: timestamp || new Date(),
      category,
      userInfo: {
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent')
      }
    });

    await newQuery.save();

    // Update daily analytics
    await updateAnalytics(category);

    res.status(201).json({ 
      success: true, 
      message: 'Query saved successfully',
      queryId: newQuery._id
    });

  } catch (error) {
    console.error('Error saving query:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error saving query',
      error: error.message 
    });
  }
};

// Get All Queries (with pagination) - FIXED VERSION
export const getAllQueries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const queries = await Query.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
      // REMOVED .select('-userInfo') to include all fields

    const total = await Query.countDocuments();

    res.json({
      success: true,
      data: queries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalQueries: total,
        queriesPerPage: limit
      }
    });

  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching queries',
      error: error.message 
    });
  }
};

// Get Queries by Session ID
export const getQueriesBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const queries = await Query.find({ sessionId })
      .sort({ timestamp: 1 });
      // REMOVED .select('-userInfo') to include all fields

    res.json({
      success: true,
      sessionId,
      count: queries.length,
      data: queries
    });

  } catch (error) {
    console.error('Error fetching session queries:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching session queries',
      error: error.message 
    });
  }
};

// Search Queries
export const searchQueries = async (req, res) => {
  try {
    const { keyword, category, startDate, endDate } = req.query;

    let searchQuery = {};

    if (keyword) {
      searchQuery.$or = [
        { userQuery: { $regex: keyword, $options: 'i' } },
        { botResponse: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (category) {
      searchQuery.category = category;
    }

    if (startDate || endDate) {
      searchQuery.timestamp = {};
      if (startDate) searchQuery.timestamp.$gte = new Date(startDate);
      if (endDate) searchQuery.timestamp.$lte = new Date(endDate);
    }

    const queries = await Query.find(searchQuery)
      .sort({ timestamp: -1 })
      .limit(100);
      // REMOVED .select('-userInfo') to include all fields

    res.json({
      success: true,
      count: queries.length,
      data: queries
    });

  } catch (error) {
    console.error('Error searching queries:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error searching queries',
      error: error.message 
    });
  }
};

// Get Analytics
export const getAnalytics = async (req, res) => {
  try {
    const totalQueries = await Query.countDocuments();
    const uniqueSessions = await Query.distinct('sessionId');
    
    // Get queries from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentQueries = await Query.countDocuments({
      timestamp: { $gte: sevenDaysAgo }
    });

    // Category distribution
    const categoryStats = await Query.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Popular queries
    const popularQueries = await Query.aggregate([
      {
        $group: {
          _id: '$userQuery',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Queries per day (last 7 days)
    const queriesPerDay = await Query.aggregate([
      {
        $match: {
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      analytics: {
        totalQueries,
        uniqueSessions: uniqueSessions.length,
        recentQueries,
        categoryDistribution: categoryStats,
        popularQueries,
        queriesPerDay,
        averageQueriesPerSession: uniqueSessions.length > 0 
          ? (totalQueries / uniqueSessions.length).toFixed(2) 
          : 0
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching analytics',
      error: error.message 
    });
  }
};

// Delete Query
export const deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Query.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: 'Query not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Query deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting query:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting query',
      error: error.message 
    });
  }
};

// Export to CSV - UPDATED to include userName and userEmail
export const exportToCSV = async (req, res) => {
  try {
    const queries = await Query.find()
      .sort({ timestamp: -1 })
      .select('sessionId userName userEmail userQuery botResponse category timestamp');

    const csv = [
      'Session ID,User Name,User Email,User Query,Bot Response,Category,Timestamp',
      ...queries.map(q => 
        `"${q.sessionId}","${q.userName || 'Anonymous'}","${q.userEmail || 'N/A'}","${q.userQuery.replace(/"/g, '""')}","${q.botResponse.replace(/"/g, '""')}","${q.category}","${q.timestamp}"`
      )
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=chatbot_queries.csv');
    res.send(csv);

  } catch (error) {
    console.error('Error exporting queries:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error exporting queries',
      error: error.message 
    });
  }
};