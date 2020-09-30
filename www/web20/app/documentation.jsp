<%@ include file="../common/header.jsp" %>
var run_launcher = function () {
	Ext.talian.REMOTING_API.enableBuffer = 0;

	var tabs = new Ext.TabPanel({
        renderTo: '_placeholder',
        activeTab: 0,
        frame:true,
        defaults:{autoScroll: true},
        items:[
            {title: 'About This Project', html: Ext.docs.shortBogusMarkup},
            {title: 'How To..', html: Ext.docs.shortBogusMarkup }
        ]
    });
}