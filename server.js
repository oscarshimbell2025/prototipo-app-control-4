const express = require('express');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.array('files'), (req, res) => {
  const urls = [];
  req.files.forEach(file => {
    const ext = path.extname(file.originalname);
    const target = file.path + ext;
    fs.renameSync(file.path, target);
    urls.push(`/uploads/${path.basename(target)}`);
  });
  res.json({ urls });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
