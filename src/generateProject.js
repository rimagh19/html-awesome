import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function generateProject(files, includeImages, includeData, projectPath) {
  const templatesDir = path.join(__dirname, 'templates'); // Assuming templates are in the ./templates folder
  
  // Ensure project directory exists
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  }

  // Copy template files if the file type is selected
  if (files.includes('html')) {
    const htmlTemplatePath = path.join(templatesDir, 'index.html');
    if (fs.existsSync(htmlTemplatePath)) {
      fs.copyFileSync(htmlTemplatePath, path.join(projectPath, 'index.html'));
    } else {
      fs.writeFileSync(path.join(projectPath, 'index.html'), '<!DOCTYPE html>\n<html>\n<head>\n<title>New Project</title>\n</head>\n<body>\n</body>\n</html>');
    }
  }

  if (files.includes('css')) {
    const cssTemplatePath = path.join(templatesDir, 'style.css');
    if (fs.existsSync(cssTemplatePath)) {
      fs.copyFileSync(cssTemplatePath, path.join(projectPath, 'style.css'));
    } else {
      fs.writeFileSync(path.join(projectPath, 'style.css'), '/* Add your CSS here */');
    }
  }

  if (files.includes('js')) {
    const jsTemplatePath = path.join(templatesDir, 'script.js');
    if (fs.existsSync(jsTemplatePath)) {
      fs.copyFileSync(jsTemplatePath, path.join(projectPath, 'script.js'));
    } else {
      fs.writeFileSync(path.join(projectPath, 'script.js'), '// Add your JavaScript here');
    }
  }

  // Create additional directories
  if (includeImages) {
    fs.mkdirSync(path.join(projectPath, 'images'), { recursive: true });
  }

  if (includeData) {
    fs.mkdirSync(path.join(projectPath, 'data'), { recursive: true });
  }

  console.log('Project files and directories created successfully!');
}