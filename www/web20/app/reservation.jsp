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
         name: 'POV',
         type: 'string'
     }, {
         name: 'POSITION',
         type: 'string'
     }, {
         name: 'COMPANY',
         type: 'string'
     }, {
         name: 'PAXWEIGHT',
         type: 'integer'
     }, {
         name: 'LUGGAGEWEIGHT',
         type: 'integer'
     }]);

	 var filters = new Ext.ux.grid.GridFilters({local: true, 
	 filters:[
				{type: 'string',  dataIndex: 'ORG'},
				{type: 'string',  dataIndex: 'DEST'}
		]});

	Ext.dsBscConf = new Ext.data.DirectStore( {
	    paramsAsHash:false,
	    root:'data',
	    directFn: DataBean.getMbo,
	    idProperty:'SCENCONFIGID',
	    totalProperty:'totalProperty',
	    fields: [
	      {name: 'SCENARIOID' },
	      {name: 'STARTPOS' },
	      {name: 'ENDPOS' },
	      {name: 'OAT' },
	      {name: 'CREWWEIGHT'},
	      {name: 'LUGGAGEWEIGHT'},
	      {name: 'PAXWEIGHT'},
	      {name: 'CONTIGENCY'},
	      {name: 'HEADWIND'},
	      {name: 'NBESTSCENARIO'},
	      {name: 'TOTALCALCTIME'},
	      {name: 'DEPT'}
	    ],
	    listeners: {
	      load: function(s, records){
			textStatus ("Loaded " + records.length + " records", true, false) ;
	      }
	    },
	    baseParams : {
	        start : 0,
	        limit : 1,
	        sort : "SCENCONFIGID",
	        mboname : "SCENCONFIG",
	        where : "SCENCONFIGID = 0",
	        dir : "ASC"
	    },
	    paramOrder: 'mboname|where|start|limit|sort|dir'
    });

    Ext.dsBscConf.load();

   	Ext.dataStoreReservation = new Ext.data.DirectStore( {
	    paramsAsHash:true,
	    root:'data',
	    directFn: DataBean.getMbo,
	    idProperty:'RESERVATIONID',
		totalProperty:'totalProperty',
		successProperty: 'success',
		messageProperty: 'message',
	    fields: fieldReservation,
		api: {
		    view: DataBean.View,
    		create: DataBean.Create,
    		update: DataBean.Update,
    		destroy: DataBean.Delete
    	},
	    listeners: {
	      load: function(s, records){
	        textStatus ("Loaded " + records.length + " records", true, false) ;
	      }
	    },
	    baseParams : {
	        start : 0,
	        limit : 10000,
	        sort : "RESERVEDATE",
	        mboname : "RESERVATION",
	        where : "reservedate={ d '"+ Ext.cDate.format(('Y-n-j')) +"' } " +
														"and flightsession='"+Ext.flightSessionId+"'",
	        dir : "DESC"
	    },
	    paramOrder: 'mboname|where|start|limit|sort|dir',
		writer: new Ext.data.JsonWriter({
    		encode: false,
    		listful: true,
    		writeAllFields: false
    	}),
    	autoSave: true,
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
	        limit : 35,
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
            {title: 'Reservation', html: '<div id=_reservation_<%=scid%>><div id=_uploadwin_<%=scid%> class="x-hidden"><div id=_uploadform_<%=scid%>></div></div></div>', listeners: {activate: activateReservation} },
            {title: 'Summary', html: '<div id=_summary_<%=scid%>></div>', listeners: {activate: activateSummary} }
        ]
    });

	var uploadwin ;
	var fp ;

    function activateReservation(tab) {
      if (!isReservationLoaded) {
		  Ext.dataStoreReservation.load();
		  var pager = new Ext.PagingToolbar({
            store: Ext.dataStoreReservation,
            displayInfo: true,
            pageSize: 10000
          });
		  var editor = new Ext.ux.grid.RowEditor({
			saveText: 'Ok',
			cancelText: 'Cancel'
		  });

		  var grid = new Ext.grid.GridPanel( {
		    renderTo: "_reservation_<%=scid%>",
		    frame: true,
		    title: "Reservation",
			plugins: filters,
		    height: 775,
		    store: Ext.dataStoreReservation,
		    stripeRows: true,
		    columns: [
		      {
		        header: 'No',
		        dataIndex: 'RESERVATIONID',
		        width: 60,
		        sortable: true
		      },
		      {
		        header: 'Date',
		        dataIndex: 'RESERVEDATE',
		        xtype: 'datecolumn',
		        format: 'd/m/Y',
		        dateFormat: 'c',
		        width: 60,
		        sortable: true
		      },
		      {
		        header: 'Session',
		        dataIndex: 'FLIGHTSESSION',
		        width: 60,
		        sortable: true,
		        editor: {
                 xtype: 'textfield',
                 allowBlank: false,
				 style : {textTransform: "uppercase"},
				 listeners:{
			         change: function(field, newValue, oldValue){
			                       field.setValue(newValue.toUpperCase());
			                   }
			     }
				}
		      },
		      {
		        header: 'Name',
		        dataIndex: 'DISPLAYNAME',
		        width: 150,
		        sortable: true,
		        editor: {
                 xtype: 'textfield',
                 allowBlank: false,
				 style : {textTransform: "uppercase"},
				 listeners:{
			         change: function(field, newValue, oldValue){
			                       field.setValue(newValue.toUpperCase());
			                   }
			     }
				}
		      },
		      {
		        header: 'Org',
		        dataIndex: 'ORG',
		        width: 40,
		        sortable: true,
				editor: {
                 xtype: 'textfield',
                 allowBlank: false,
				 style : {textTransform: "uppercase"},
				 listeners:{
			         change: function(field, newValue, oldValue){
			                       field.setValue(newValue.toUpperCase());
			                   }
			     }
				}
		      },
		      {
		        header: 'Dest',
		        dataIndex: 'DEST',
		        width: 40,
		        sortable: true,
				editor: {
                 xtype: 'textfield',
                 allowBlank: false,
				 style : {textTransform: "uppercase"},
				 listeners:{
			         change: function(field, newValue, oldValue){
			                       field.setValue(newValue.toUpperCase());
			                   }
			     }
				}
		      },
		      {
		        header: 'Company',
		        dataIndex: 'COMPANY',
		        width: 60,
		        sortable: true,
		        editor: {
                 xtype: 'textfield',
                 allowBlank: true,
				 style : {textTransform: "uppercase"},
				 listeners:{
			         change: function(field, newValue, oldValue){
			                       field.setValue(newValue.toUpperCase());
			                   }
			     }
				}
		      },
		      {
		        header: 'Position',
		        dataIndex: 'POSITION',
		        width: 60,
		        sortable: true,
		        editor: {
                 xtype: 'textfield',
                 allowBlank: true,
				 style : {textTransform: "uppercase"},
				 listeners:{
			         change: function(field, newValue, oldValue){
			                       field.setValue(newValue.toUpperCase());
			                   }
			     }
				}
		      },
		      {
		        header: 'POV',
		        dataIndex: 'POV',
		        width: 60,
		        sortable: true,
		        editor: {
                 xtype: 'textfield',
                 allowBlank: false,
				 style : {textTransform: "uppercase"},
				 listeners:{
			         change: function(field, newValue, oldValue){
			                       field.setValue(newValue.toUpperCase());
			                   }
			     }
				}
		      },
		      {
		        header: 'Passenger Weight',
		        dataIndex: 'PAXWEIGHT',
		        width: 60,
		        sortable: true,
		        editor: {
                 xtype: 'textfield',
                 allowBlank: false
				}
		      },
		      {
		        header: 'Luggage Weight',
		        dataIndex: 'LUGGAGEWEIGHT',
		        width: 60,
		        sortable: true,
		        editor: {
                 xtype: 'textfield',
                 allowBlank: false
				}
		      }
		    ],
		    bbar:pager,
			plugins: [editor, filters],
		    viewConfig: {forceFit:true},
			tbar: [{iconCls: 'icon-user-add', text:'Add Reservation',
					handler: function() {
								var e = new fieldReservation( {
								    RESERVEDATE:  Ext.cDate.format(('n/j/Y')),
									FLIGHTSESSION: Ext.flightSessionId,
									ORG:       'SPG',
									DEST:      'SPG',
									PAXWEIGHT: Ext.dsBscConf.getAt(0).data.PAXWEIGHT,
									LUGGAGEWEIGHT: Ext.dsBscConf.getAt(0).data.LUGGAGEWEIGHT
								} ) ;
								editor.stopEditing () ;
								Ext.dataStoreReservation.insert(0, e);
								grid.getView().refresh();
								grid.getSelectionModel().selectRow(0);
								editor.startEditing(0);
							 }
					},
				 {iconCls: 'icon-user-save', text: 'Save All Modifications',
				  handler: function(){
								//editor.stopEditing () ;
					            //Ext.dataStoreReservation.save();
								//grid.getView().refresh();
								Ext.dataStoreReservation.reload();
				            }
				 },
				 new Ext.Button({iconCls: 'icon-excel', text: 'Upload XLS',
				  handler: function(){
								editor.stopEditing () ;
								grid.getView().refresh();

								if(!uploadwin) {
								    fp = new Ext.FormPanel({
										renderTo: '_uploadwin_<%=scid%>',
										fileUpload: true,
										width: 500,
										title: 'File Upload Form',
										autoHeight: true,
										bodyStyle: 'padding: 10px 10px 0 10px;',
										labelWidth: 50,
										defaults: {
											anchor: '95%',
											allowBlank: false,
											msgTarget: 'side'
										},
										api: {
											submit: EditorBean.uploadFile
										},
										items: [{
											xtype: 'fileuploadfield',
											id: 'form-file',
											emptyText: 'Select an XLS file',
											fieldLabel: 'File',
											name: 'xls-path',
											buttonText: 'Browse...',
											buttonCfg: {
												iconCls: 'upload-icon'
											}
										},{
											name:'clear',
											fieldLabel:'Delete All',
											xtype:'checkbox',
											checked:false
										}],
										buttons: [{
											text: 'Save',
											handler: function(){
												if(fp.getForm().isValid()){
													fp.getForm().submit({
														waitMsg: 'Uploading Reservation...',
														success: function(fp, o) {
														    Ext.dataStoreReservation.load();
															grid.getView().refresh();
															msg('Success', 'Processed file "'+o.result.file+'" on the server');
														}
													});
												}
											}
										}, {
											text: 'Close',
											handler: function(){
												uploadwin.hide();
											}
										}]
									});

									uploadwin = new Ext.Window({
										applyTo: '_uploadwin_<%=scid%>',
										layout:'fit',
										width:500,
										height:320,
										closeAction:'hide',
										plain: true,
										items: fp
									});
								}
								else {
								    fp.getForm().reset();
								}

								uploadwin.show(this);
				            }
				 })]
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