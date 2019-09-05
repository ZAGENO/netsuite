const dataType = "inventoryitem";

function GET(data) {
    return nlapiLoadRecord(dataType, data.id);
}

function POST(data) {
  var err = new Object();

  if (!data)
  {
      err.status = "failed";
      err.message= "missing input data";
      return err;
  }

  var record;
  var filters = new Array();
  filters[0] = new nlobjSearchFilter('itemid', null, 'contains', data.itemid, null);
  var searchResults = new nlapiSearchRecord(dataType, null, filters, null);
  if (searchResults.length==1) {
    record = nlapiLoadRecord(dataType, searchResults[0].getId());
  }
  else {
    record = nlapiCreateRecord(dataType);
  }

  for (var fieldname in data)
  {
     if (data.hasOwnProperty(fieldname))
     {
         var value = data[fieldname];
         if (value && typeof value != 'object')
         {
             record.setFieldValue(fieldname, value);
         }
     }
  }
  var recordId = nlapiSubmitRecord(record);
  nlapiLogExecution('DEBUG','id='+recordId);
  var nlobj = nlapiLoadRecord(data.recordtype,recordId);
  return nlobj;
}
