const dataType = "purchaseorder";
const targetDataType = "vendorbill";

function GET(data) {
   return nlapiLoadRecord(dataType, data.id);
}

function POST_OLD(data) {
  data = JSON.parse(data);
  var po = nlapiLoadRecord(dataType, data.id);
  var vb_record = nlapiTransformRecord(dataType, data.id, targetDataType);
  var vb = nlapiSubmitRecord(vb_record);
  for (var j = record.getLineItemCount('item'); j>=1; j--)
  {
    record.setLineItemVlaue('item','amount', j, '31.13');
  }
  return JSON.stringify(vb);
}

function update_all(count, record, data) {
  for (var fieldname in data)
  {
    if (data.hasOwnProperty(fieldname))
    {
      if (fieldname != 'recordtype' && fieldname != 'id')
      {
        var value = data[fieldname];
        if (value && typeof value != 'object') // ignore other type of parameters
        {
          record.setLineItemValue('item',fieldname, count, value);
        }
      }
    }
  }
}

function POST(data) {
  //data = JSON.parse(data);
  var po = nlapiLoadRecord(dataType, data.id);
  var vb_record = nlapiTransformRecord(dataType, data.id, targetDataType);
  for (var j = vb_record.getLineItemCount('item'); j>=1; j--)
  {
    for(var i=data.items.length; i>=1; i-- ) {
        if(vb_record.getLineItemValue('itemid')===data.items[i].itemid) {
          update_all(j, vb_record, data.item[i]);
        }
    }
  }
  var vb = nlapiSubmitRecord(vb_record);
  vb.comm
  return vb;
}