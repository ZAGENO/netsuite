function GET(datain) {
    return nlapiLoadRecord(datain.recordtype, datain.id);
}

function POST(datain) {
  var err = new Object();

  // Validate if mandatory record type is set in the request
  if (!datain.recordtype)
  {
      err.status = "failed";
      err.message= "missing recordtype";
      return err;
  }

  var record = nlapiCreateRecord(datain.recordtype);
  
  for (var fieldname in datain)
  {
     if (datain.hasOwnProperty(fieldname))
     {
         if (fieldname != 'recordtype' && fieldname != 'id')
         {
             var value = datain[fieldname];
             if (value && typeof value != 'object')
             {
                 record.setFieldValue(fieldname, value);
             }
         }
     }
  }
  var recordId = nlapiSubmitRecord(record);
  nlapiLogExecution('DEBUG','id='+recordId);
  var nlobj = nlapiLoadRecord(datain.recordtype,recordId);
  return nlobj;
}

//curl -X POST -d '{"recordtype":"inventoryitem", "displayname": "Keybaord Test Test", "itemid": "My mechanical keyboard"}' -H "Authorization: NLAuth nlauth_account=TSTDRV2136536_RP, nlauth_email=sankar@zageno.com, nlauth_signature=9D7iSj6Gr5" -H "Content-Type: application/json" "https://tstdrv2136536-rp.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=547&deploy=2" | python -m json.tool

