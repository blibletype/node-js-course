const fs = require('fs');

exports.deleteFile = (filePath) => {
  fs.unlink(filePath, (error) => {
    if (error) {
      throw error;
    }
  });
};
