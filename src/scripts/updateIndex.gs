function updateIndex() {
  const API_URL = 'https://api.lovable.ai/update-index';
  
  try {
    const response = UrlFetchApp.fetch(API_URL, {
      method: 'post',
      muteHttpExceptions: true
    });
    
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    if (responseCode === 200) {
      Logger.log('Index updated successfully');
    } else {
      Logger.log('Error updating index: ' + responseText);
    }
  } catch (error) {
    Logger.log('Error: ' + error.toString());
  }
}

// 매일 자정에 실행되도록 트리거 설정
function createDailyTrigger() {
  ScriptApp.newTrigger('updateIndex')
    .timeBased()
    .everyDays(1)
    .atHour(0)
    .create();
} 