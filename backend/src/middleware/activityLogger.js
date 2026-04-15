const ActivityLog = require('../models/ActivityLog');

const activityLogger = (actionName) => {
  return async (req, res, next) => {
    // Intercept response finish
    res.on('finish', async () => {
      // Only log successful actions or explicit failures we want to track
      // If we want to capture everything, we can do it here
      try {
        const userId = req.loggedUserId || req.userId;
        const role = req.loggedUserRole || req.userRole;
        const userName = req.loggedUserName || (req.user ? req.user.name : 'Unknown');
        const target = req.actionTarget || '-';
        const result = res.statusCode >= 200 && res.statusCode < 400 ? 'success' : 'failed';
        
        const pad = (n) => n < 10 ? '0'+n : n;
        const date = new Date();
        // '2026-04-09 09:00' format
        const formattedTimestamp = `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;

        await ActivityLog.create({
          user_id: userId || null,
          userName: userName,
          role: role || 'guest',
          action: actionName,
          target: target,
          result: result,
          ip_address: req.ip,
          timestamp: formattedTimestamp
        });
      } catch (err) {
        console.error('Failed to log activity', err.message);
      }
    });

    next();
  };
};

module.exports = activityLogger;
