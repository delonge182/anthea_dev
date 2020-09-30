<%@ include file="../common/header.jsp" %>
var run_launcher = function () {
	Ext.talian.REMOTING_API.enableBuffer = 0;

	var win2 = new Ext.Window({
	    applyTo:'_placeholder',
	         layout:'fit',
	         width:1200,
	         height:800,
	         modal:true,
	         items: [new Ext.ux.ManagedIFrame.Panel(
	                 {   xtype    : 'mif',
	                     defaultSrc:"../../frameset?__report=helico/dailyflightschedule.rptdesign&scenid="+Ext.cmbScenario.value,
	                     loadMask: true
	                 }
	               )]

     });

     win2.show();
}