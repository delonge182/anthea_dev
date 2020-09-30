<%@ include file="../common/header.jsp" %>
var run_launcher = function () {
	Ext.talian.REMOTING_API.enableBuffer = 0;
   	var remotingProvider = Ext.Direct.addProvider( Ext.talian.REMOTING_API);
   	
   	Djn.RemoteCallSupport.addCallValidation(remotingProvider);
    Djn.RemoteCallSupport.validateCalls = true;
   	
	var out ;
	var isFleetPosLoaded = false ;	
	var dsFleetPosition = <%=com.talian.beans.common.DataBean.getDataSource(sessionContext, "FLEETPOS", "", "TRIPDATE,FLIGHTSESSION,FLEET", "")%>
	
	var tabs = new Ext.TabPanel({
        renderTo: '_placeholder',
        activeTab: 0,
        frame:true,
        defaults:{autoScroll: true},
        items:[
            {title: 'Reservation', html: 'Reservation Summary : <%=s%>>'},
            {title: 'Fleet Position', html: '<div id=_fleetposition_<%=scid%>></div>', listeners: {activate: activateFleetPosition} },
            {title: 'Port Status', html: 'Port Status<BR/>SC=<%=scid%>'},
            {title: 'Progress', html: '<div id=_form_<%=scid%>></div><div id=_progress_<%=scid%>></div>', listeners: {activate: activateProgress}, autoScroll: true }         
        ]
    });
    
    function activateProgress(tab) {
	    if (typeof out == "undefined") {
		    Ext.Direct.addProvider(
		        Ext.talian.REMOTING_API,
		        {
		            id: 'pollProvider',
		            type:'polling',
		            url: Ext.talian.POLLING_URLS.log,
		            interval: 1000
		        }
		    );
		    
		    var pollProvider = Ext.Direct.getProvider('pollProvider') ;
		    pollProvider.disconnect() ;
		    
		    var form = new Ext.FormPanel({
			    url: Ext.talian.PROVIDER_BASE_URL,
			    frame: true,
			    width: 300,
			    labelWidth: 100,
			    autoHeight:true,
			    fileUpload : true,
			    renderTo:'_form_<%=scid%>',
			    items : [
			    	new Ext.form.ComboBox({
			    		store: ['0730','0915', '1100', '1300', '1500'],
			    		selectOnFocus:true,
			    		fieldLabel: 'Flight Session',
        				name: 'flightsession',
        				width: 100
			    	}),
			    	{
			    	   xtype: 'datefield',
			    	   fieldLabel: 'Trip Date',
			    	   value: '11-Jan-2011',
			    	   name: 'transdate',
			    	   width: 100,	
			    	}
			    ],
			    buttons : [
			    	{ text : 'Start',
			    	  handler: function(){
			    	  				pollProvider.connect () ;
			          				SchedullingBean.handleSubmit(form.getForm().el, function(result, e){
				            			if( e.type === 'exception') {
				            			    out.append('<p><b>=== Unexpected server error : ' + e.message + '</b></p>') ;
				              				return;
				            			}
				            			out.append (result.remarks);
			          				}) ;
			          			}	
			    	},
			    	{ text : 'Stop',
			    	  handler: function() {
			    	                pollProvider.disconnect () ;
			    	                out.append ("=== Polling stopped...");
			    	           }
			    	}
			    ] } ) ;
			    
		    
		    out = new Ext.form.DisplayField({
		        cls: 'x-form-text',
		        renderTo: '_progress_<%=scid%>',
		        id: 'out',
		        layout: 'fit' 
		    });
		    		    		    
		    Ext.Direct.on('log', function(e){
	        	out.append(String.format('<p>{0}</p>', e.data));
	            out.el.scroll('b', 100000, true);
	            if (e.data.indexOf('DONE') != -1 ) 
	                pollProvider.disconnect () ;
	    	});
	    	
	    }	     
    }
    
    function activateFleetPosition(tab) {
      if (!isFleetPosLoaded) {		  
		  dsFleetPosition.load();
		  var pager = new Ext.PagingToolbar({
            store: dsFleetPosition,
            displayInfo: true,
            pageSize: 20
          });
		  var grid = new Ext.grid.GridPanel( {
		    renderTo: "_fleetposition_<%=scid%>",
		    frame: true,
		    title: "Fleet Position",
		    height: 300,
		    store: dsFleetPosition,
		    stripeRows: true,
		    columns: [
		      {
		        header: 'Date',
		        dataIndex: 'TRIPDATE',
		        width: 60
		      },
		      {
		        header: 'Session',
		        dataIndex: 'FLIGHTSESSION',
		        width: 60
		      },
		      {
		        header: 'Fleet',
		        dataIndex: 'FLEET',
		        width: 40
		      },
		      {
		        header: 'Position',
		        dataIndex: 'POSITION',
		        width: 40
		      },
		      {
		        header: 'Status',
		        dataIndex: 'STATUS',
		        width: 60
		      }
		    ],
		    bbar:pager,
		    viewConfig: {
            	forceFit:true
            }
		  }) ; 
		  isSummaryLoaded = true ;
	   }			      	
    }
} 