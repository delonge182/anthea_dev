<%@ include file="../common/header.jsp" %>
var run_launcher = function () {
    var dom1 = Ext.get('_placeholder').dom ;
	
    var dr = new Ext.FormPanel({
      labelWidth: 125,
      frame: true,
      title: 'Date Range',
      bodyStyle:'padding:5px 5px 0',
      width: 400,
      defaults: {width: 175},
      defaultType: 'datefield',
      items: [{
        fieldLabel: 'Start Date',
        name: 'startdt',
        id: 'startdt'
      },{
        fieldLabel: 'End Date',
        name: 'enddt',
        id: 'enddt'
      }]
    });

    dr.render('_placeholder');
	
    // dom1.innerHTML = 'Security' ; 
} 