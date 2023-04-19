chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	window.ExchangeRateIOP           = request.exchange_rate_IOP;
  	window.ExchangeRateIOTX          = request.exchange_rate_IOTX;
  	window.MarketplaceFloorPriceIOTX = request.marketplace_floor_price_iotx;
  	window.AdditionalIOPPerDay       = request.additional_IOP_per_day;
  	ShowTotals();
    sendResponse({status: "OK"});
  }
);

function ShowTotals(){
	if (typeof(window.objInterval) !== 'undefined') clearInterval(window.objInterval);
	sSelector = '*[class^="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-bold focus:outline-none hover:shadow font-sans px-7 py-2 rounded-full text-white bg-primary bg-gradient-to-b from-primary to-primary-light border border-transparent active:bg-primary-hover hover:bg-primary-hover"]';
	objDAO = document.querySelectorAll(sSelector);
	TotalRewards = 0;
	TotalPunks   = 0;
	TotalPunksL1 = 0;
	TotalPunksL2 = 0;
	TotalPunksL3 = 0;
	TotalPunksL4 = 0;
	for (iCounter=0; iCounter<objDAO.length; iCounter++) {
	  if (objDAO[iCounter].innerText.includes('UPGRADE PUNK TO LEVEL 2')) TotalPunksL1++;
	  if (objDAO[iCounter].innerText.includes('UPGRADE PUNK TO LEVEL 3')) TotalPunksL2++;
	  if (objDAO[iCounter].innerText.includes('UPGRADE PUNK TO LEVEL 4')) TotalPunksL3++;
	  if (objDAO[iCounter].innerText.includes('UPGRADED TO MAX')) TotalPunksL3++;
	  if (objDAO[iCounter].innerText.includes('CLAIM IOP Point Rewards')) {
	    TotalRewards += Number(objDAO[iCounter].innerText.replace('CLAIM IOP Point Rewards ', ''));
	    TotalPunks++;
	  }
	}
	sSelector = '*[class^="align-bottom inline-flex items-center  justify-center cursor-pointer leading-5 transition-colors  duration-150 font-bold focus:outline-none hover:shadow  font-sans px-7 py-2 rounded-full text-sm text-black bg-primary  bg-gradient-to-b from-primary to-primary-light border border-transparent  active:bg-primary-hover hover:bg-primary-hover listedforsale greenbuy2"]';
	objDAO = document.querySelectorAll(sSelector);

	objDAO[0].innerText='Claim ' + Math.round(TotalRewards*100)/100 + ' IOP ($' + Math.round(TotalRewards * window.ExchangeRateIOP * 100) / 100 + ' / ~' + Math.round(TotalRewards * window.ExchangeRateIOP/window.ExchangeRateIOTX * 100) / 100 + ' IOTX)';

  TotalPunkIOP_Day = TotalPunksL1 + (TotalPunksL2*2) + (TotalPunksL3*3) + (TotalPunksL4*4);

	IOP_Month = TotalPunkIOP_Day * 30;
	IOP_Day   = TotalPunkIOP_Day * 1;
	IOP_Hour  = Math.round(TotalPunkIOP_Day / 24 * 100) / 100;

	USD_Month = Math.round(IOP_Month * window.ExchangeRateIOP * 100) / 100;
	USD_Day   = Math.round(IOP_Day * window.ExchangeRateIOP * 100) / 100;
	USD_Hour  = Math.round(IOP_Day / 24 * window.ExchangeRateIOP * 100) / 100;

	IOP_Day_Other   = window.AdditionalIOPPerDay * 1;
	IOP_Month_Other = IOP_Day_Other * 30;
	IOP_Hour_Other  = Math.round(IOP_Day_Other / 24 * 100) / 100;

	USD_Month_Other = Math.round(IOP_Month_Other * window.ExchangeRateIOP * 100) / 100;
	USD_Day_Other   = Math.round(IOP_Day_Other * window.ExchangeRateIOP * 100) / 100;
	USD_Hour_Other  = Math.round(IOP_Day_Other / 24 * window.ExchangeRateIOP * 100) / 100;

	USD_Month_Total = Math.round((USD_Month + USD_Month_Other) * 100) / 100;
	USD_Day_Total   = Math.round((USD_Day + USD_Day_Other) * 100) / 100;
	USD_Hour_Total  = Math.round((USD_Day + USD_Day_Other) / 24 * 100) / 100;

	document.getElementsByClassName('container mt-20 mb-10')[0].childNodes[0].style.fontSize='28px';
	document.getElementsByClassName('container mt-20 mb-10')[0].childNodes[0].innerHTML = 'YOUR ' + TotalPunks + ' IOTEX PUNK NFT COLLECTION<br />\
		Market Value (floor ' + window.MarketplaceFloorPriceIOTX + ' IOTX/punk): ' + (TotalPunks * window.MarketplaceFloorPriceIOTX) + ' IOTX ($' + (TotalPunks * window.MarketplaceFloorPriceIOTX * window.ExchangeRateIOTX) + ')<br />\
		Level 1: ' + TotalPunksL1 + ' | Level 2: ' + TotalPunksL2 + ' | Level 3: ' + TotalPunksL3 + '<br />\
		Current Wallet - IOP: ' + IOP_Month + '/month | ' + IOP_Day + '/day | ' + IOP_Hour + '/hour<br />\
		Current Wallet - $' + USD_Month + '/month | $' + USD_Day + '/day | $' + USD_Hour + '/hour<br /><br />\
		Other Sources - IOP: ' + IOP_Month_Other + '/month | ' + IOP_Day_Other + '/day | ' + IOP_Hour_Other + '/hour<br />\
		Other Sources - $' + USD_Month_Other + '/month | $' + USD_Day_Other + '/day | $' + USD_Hour_Other + '/hour<br /><br />\
		Total - IOP: ' + (IOP_Month + IOP_Month_Other) + '/month | ' + (IOP_Day + IOP_Day_Other) + '/day | ' + (IOP_Hour + IOP_Hour_Other) + '/hour<br />\
		Total - $' + USD_Month_Total + '/month | $' + USD_Day_Total + '/day | $' + USD_Hour_Total + '/hour';
	if (typeof(window.objInterval) === 'undefined') window.objInterval = setInterval(ShowTotals, 2000);
}