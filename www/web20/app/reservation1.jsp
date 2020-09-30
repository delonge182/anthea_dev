<%@ include file="../common/header.jsp" %>
var run_launcher = function () {
    Ext.talian.REMOTING_API.enableBuffer = 0;
   	var remotingProvider = Ext.Direct.addProvider( Ext.talian.REMOTING_API);
   	var isReservationLoaded = false ;
   	var isSummaryLoaded = false ;
	
	var fieldReservation = Ext.data.Record.create([
     {
         name: 'RESERVATIONID',
         type: 'long'
     }, {
         name: 'RESERVEDATE',
         type: 'date'
     }, {
         name: 'FLIGHTSESSION',
         type: 'string'
     }, {
         name: 'DISPLAYNAME',
         type: 'string'
     }, {
         name: 'ORG',
         type: 'string'
     }, {
         name: 'DEST',
         type: 'string'
     }, {
         name: 'POSITION',
         type: 'string'
     }, {
         name: 'COMPANY',
         type: 'string'
     }, {
         name: 'COSTCODE',
         type: 'string'
     }]);
   	
   	var dataStoreReservation = new Ext.data.DirectStore( {
	    paramsAsHash:false,
	    root:'data',
	    directFn: DataBean.getMbo,
	    idProperty:'RESERVATIONID',
		totalProperty:'totalProperty',
		successProperty: 'success',
		messageProperty: 'message',  
	    fields: fieldReservation,
		api: {
    		create: DataBean.create,
    		update: DataBean.update,
    		destroy: DataBean.delete
    	},
	    listeners: {
	      load: function(s, records){
	        textStatus ("Loaded " + records.length + " records", true, false) ;
	      }
	    },
	    baseParams : {
	        start : 0,
	        limit : 20,
	        sort : "RESERVATIONID",
	        mboname : "RESERVATION",
	        where : "1=1",
	        dir : "ASC"
	    },
	    paramOrder: 'mboname|where|start|limit|sort|dir',
		writer: new Ext.data.JsonWriter({
    		encode: false,
    		listful: true,
    		writeAllFields: false
    	}),
    	autoSave: false,
		paramsAsHash: false,
		handleException : function(e) {        
			alert (e) ;
		}
    });

   	var dataStoreSummary = new Ext.data.DirectStore( {
	    paramsAsHash:false,
	    root:'',
	    directFn: DataBean.getMbo,
	    idProperty:'RESERVSUMID',
	    fields: [
	      {name: 'RESERVSUMID' },
	      {name: 'RESERVEDATE' },
	      {name: 'FLIGHTSESSION' },
	      {name: 'ORG'},
	      {name: 'DEST'},
	      {name: 'NPAX'},
	      {name: 'WEIGHT'}
	    ],
	    listeners: {
	      load: function(s, records){
	        textStatus ("Loaded " + records.length + " records", true, false) ;
	      }
	    },
	    baseParams : {
	        start : 0,
	        limit : 40,
	        sort : "RESERVEDATE,FLIGHTSESSION,ORG",
	        mboname : "RESERVSUM",
	        dir : ""
	    },
	    paramOrder: 'mboname|where|start|limit|sort|dir'  		    
    });

	var tabs = new Ext.TabPanel({
        renderTo: '_placeholder',
        activeTab: 0,
        frame:true,
        defaults:{autoHeight: true},
        items:[
            {title: 'Reservation', html: '<div id=_reservation_<%=scid%>></div>', listeners: {activate: activateReservation} },
            {title: 'Summary', html: '<div id=_summary_<%=scid%>></div>', listeners: {activate: activateSummary} }
        ]
    }); 

    function activateReservation(tab) {
      if (!isReservationLoaded) {		  
		  dataStoreReservation.load();
		  var pager = new Ext.PagingToolbar({
            store: dataStoreReservation,
            displayInfo: true,
            pageSize: 20
          });
		  var editor = new Ext.ux.grid.RowEditor({
			saveText: 'Ok',
			cancelText: 'Cancel'
		  });
		  
		  var grid = new Ext.grid.GridPanel( {
		    renderTo: "_reservation_<%=scid%>",
		    frame: true,
		    title: "Reservation",
		    height: 530,
		    store: dataStoreReservation,
		    stripeRows: true,
		    columns: [
		      {
		        header: 'No',
		        dataIndex: 'RESERVATIONID',
		        width: 60
		      },
		      {
		        header: 'Date',
		        dataIndex: 'RESERVEDATE',
		        width: 60
		      },
		      {
		        header: 'Session',
		        dataIndex: 'FLIGHTSESSION',
		        width: 60
		      },
		      {
		        header: 'Name',
		        dataIndex: 'DISPLAYNAME',
		        width: 150
		      },
		      {
		        header: 'Org',
		        dataIndex: 'ORG',
		        width: 40,
				editor: {
                 xtype: 'textfield',
                 allowBlank: false
				}
		      },
		      {
		        header: 'Dest',
		        dataIndex: 'DEST',
		        width: 40,
				editor: {
                 xtype: 'textfield',
                 allowBlank: false
				}
		      },
		      {
		        header: 'Company',
		        dataIndex: 'COMPANY',
		        width: 60
		      },
		      {
		        header: 'Position',
		        dataIndex: 'POSITION',
		        width: 60
		      },
		      {
		        header: 'Cost-code',
		        dataIndex: 'COSTCODE',
		        width: 40
		      }
		    ],
		    bbar:pager,
			plugins: [editor],
		    viewConfig: {forceFit:true},
			tbar: [{iconCls: 'icon-user-add', text:'Add Reservation', 
					handler: function() {
								var e = new fieldReservation( {
									RESERVATIONID: 00000,
									RESERVEDATE:  '05-SEP-2011',
									ORG:       'SPG',
									DEST:      'SPG'
								} ) ;
								editor.stopEditing () ;
								dataStoreReservation.insert(0, e);
								grid.getView().refresh();
								grid.getSelectionModel().selectRow(0);
								editor.startEditing(0);
							 }
					},
				 {iconCls: 'icon-user-save', text: 'Save All Modifications',
				  handler: function(){
								editor.stopEditing () ;
					            dataStoreReservation.save();
				            }
				 }]
		  }) ; 
		  isReservationLoaded = true ;
	   }			      	
    }
    
    function activateSummary(tab) {
      if (!isSummaryLoaded) {		  
		  dataStoreSummary.load();
		  var pager = new Ext.PagingToolbar({
            store: dataStoreSummary,
            displayInfo: true,
            pageSize: 20
          });
		  var grid = new Ext.grid.GridPanel( {
		    renderTo: "_summary_<%=scid%>",
		    frame: true,
		    title: "Summary",
		    height: 300,
		    store: dataStoreSummary,
		    stripeRows: true,
		    columns: [
		      {
		        header: 'Date',
		        dataIndex: 'RESERVEDATE',
		        width: 60
		      },
		      {
		        header: 'Session',
		        dataIndex: 'FLIGHTSESSION',
		        width: 60
		      },
		      {
		        header: 'Org',
		        dataIndex: 'ORG',
		        width: 40
		      },
		      {
		        header: 'Dest',
		        dataIndex: 'DEST',
		        width: 40
		      },
		      {
		        header: 'Pax',
		        dataIndex: 'NPAX',
		        width: 60
		      },
		      {
		        header: 'Weight',
		        dataIndex: 'WEIGHT',
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