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

function POST(data) {
  //data = JSON.parse(data);
  var po = nlapiLoadRecord(dataType, data.id);
  var vb_record = nlapiTransformRecord(dataType, data.id, targetDataType);
  for (var j = vb_record.getLineItemCount('item'); j>=1; j--)
  {
    vb_record.setLineItemValue('item','amount', j, '31.13');
  }
  var vb = nlapiSubmitRecord(vb_record);
  vb.comm
  return vb;
}