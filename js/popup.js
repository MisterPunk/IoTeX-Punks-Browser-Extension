let actionShowTotals           = document.getElementById('actionShowTotals');
let ExchangeRateIOP            = 0;
let ExchangeRateIOTX           = 0;
let AdditionalIOPPerDay        = 0;

function actionInitialize() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, files: ['js/content.js'], }, () => {});
  });
  $.ajax({
    type: "POST",
    url: 'https://graph.mimo.exchange/subgraphs/name/mimo/mainnet_v6_2',
    contentType: 'application/json',
    data: JSON.stringify({ "operationName":"TokenDayData", "query": "{ tokenDayDatas(first: 1, orderBy: date, orderDirection: desc, where: { token: \"0x985478eaca15464ad6968409e3e8a8b7c1675ae4\"}) { id date token { id symbol } priceUSD } }", "variables": {} }),
    success: function(result, status){
      console.log(result);
      if (typeof(result.data) === 'undefined') result = JSON.parse(result);
      console.log(result.data);
      TokenPrice = result.data.tokenDayDatas[0].priceUSD;
      TokenPrice = Math.round(TokenPrice * 10000) / 10000;
      $('#ExchangeRateIOP').val(TokenPrice);
    }
  });
  $.ajax({
    type: "POST",
    url: 'https://graph.mimo.exchange/subgraphs/name/mimo/mainnet_v6_2',
    contentType: 'application/json',
    data: JSON.stringify({ "operationName":"bundles", "query": "query bundles { bundles(where: {id:1}) { id ethPrice __typename } }", "variables": {} }),
    success: function(result_iotx, status){
      console.log(result_iotx);
      if (typeof(result_iotx.data) === 'undefined') result_iotx = JSON.parse(result_iotx);
      console.log(result_iotx.data);
      TokenPriceIOTX = result_iotx.data.bundles[0].ethPrice;
      TokenPriceIOTX = Math.round(TokenPriceIOTX * 10000) / 10000;
      $('#ExchangeRateIOTX').val(TokenPriceIOTX);
    }
  });
}


jQuery(document).ready(function() {
  actionInitialize();
});


actionShowTotals.onclick = async function(e) {
  let queryOptions = { active: true, currentWindow: true };
  let tabs = await chrome.tabs.query(queryOptions);

  ExchangeRateIOP           = document.getElementById('ExchangeRateIOP').value;
  ExchangeRateIOTX          = document.getElementById('ExchangeRateIOTX').value;
  AdditionalIOPPerDay       = document.getElementById('AdditionalIOPPerDay').value;
  MarketplaceFloorPriceIOTX = document.getElementById('MarketplaceFloorPriceIOTX').value;
  chrome.tabs.sendMessage(tabs[0].id, { exchange_rate_IOP: ExchangeRateIOP, exchange_rate_IOTX: ExchangeRateIOTX, marketplace_floor_price_iotx: MarketplaceFloorPriceIOTX, additional_IOP_per_day: AdditionalIOPPerDay }, function(response) {
    console.log(response.status);
  });
}