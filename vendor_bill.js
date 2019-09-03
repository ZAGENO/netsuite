function this_is_get(datain) {
    datain = JSON.parse(datain);
    //return "Record Type " + datain.recordtype + " id " + datain.id + " Datain " + datain + JSON.stringify(datain);
    return JSON.stringify(nlapiLoadRecord(datain.recordtype, datain.id));
    //return JSON.stringify(nlapiSearchRecord(datain.recordtype, datain.id));
}

function this_is_post(datain) {
  //datain = JSON.parse(datain);
  var err = new Object();

  // Validate if mandatory record type is set in the request
  if (!datain.recordtype)
  {
      err.status = "failed";
      err.message= "missing recordtype";
      return JSON.stringify(err);
  }

  var record = nlapiCreateRecord(datain.recordtype);
  //return record;
  //var item = nlapiLoadRecord('inventoryitem', '504');
  //return record;
  //record.setFieldValue('item', item);
  record.selectNewLineItem('item');
  record.setCurrentLineItemValue('item','item',504);
  record.setCurrentLineItemValue('item', 'location', 2);
  record.setCurrentLineItemValue('item', 'amount', '2');
  //record.setCurrentLineItemValue('item', 'customer',2);
  record.setCurrentLineItemValue('item','isbillable','T');
  record.commitLineItem('item');
  
  for (var fieldname in datain)
  {
    if (datain.hasOwnProperty(fieldname))
      {
        if (fieldname != 'recordtype' && fieldname != 'id' && fieldname != 'items')
        {
          var value = datain[fieldname];
          if (value && typeof value != 'object') // ignore other type of parameters
            {
              record.setFieldValue(fieldname, value);
            }
         }
     }
  }
  //var subrecord = record.createSubrecord('inventoryitem');
  //return record.getAllFields();
  var recordId = nlapiSubmitRecord(record);
  nlapiLogExecution('DEBUG','id='+recordId);

  var nlobj = nlapiLoadRecord(datain.recordtype,recordId);
  return nlobj;
}

// e.g: curl -X POST -d {"recordtype":"vendorbill", "entity":"1055", "subsidiary":"1", "postingperiod":"268", "location":"2"} -H Authorization: NLAuth nlauth_account=TSTDRV2136536_RP, nlauth_email=sankar@zageno.com, nlauth_signature=9D7iSj6Gr5 -H Content-Type: application/json https://tstdrv2136536-rp.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=548&deploy=1 | python -m json.tool
