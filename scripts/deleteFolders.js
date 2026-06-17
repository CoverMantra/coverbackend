const fs = require('fs');
const path = require('path');

const targetFolders = [
  '../../coverfrontend/src/app/LenderAPI/zype',
  '../../coverfrontend/src/app/LenderAPI/moneyView',
  '../../coverfrontend/src/app/LenderAPI/vivifi',
  '../../coverfrontend/src/app/LenderAPI/fatakPay',
  '../../coverfrontend/src/app/LenderAPI/fatakPaydcl'
];

targetFolders.forEach(folderPath => {
  const absolutePath = path.resolve(__dirname, folderPath);
  try {
    if (fs.existsSync(absolutePath)) {
      fs.rmSync(absolutePath, { recursive: true, force: true });
      console.log(`Successfully deleted: ${absolutePath}`);
    } else {
      console.log(`Path does not exist: ${absolutePath}`);
    }
  } catch (error) {
    console.error(`Error deleting ${absolutePath}:`, error.message);
  }
});
