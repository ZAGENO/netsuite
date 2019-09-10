function GET(data) {
  //return "this is data: " + JSON.stringify(data);
  data = JSON.parse(data);
  var filters = new Array();
  filters[0] = new nlobjSearchFilter( data.key, null, 'contains', data.value, null
);
  var searchresults = nlapiSearchRecord('inventoryitem', null, filters, null);
  return JSON.stringify(searchresults[0]);
}
