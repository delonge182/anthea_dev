/*!
 * Ext JS Library 3.2.1
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */


// setup drag and drop zone
Ext.namespace('Ext.talian.gmap.data');

var isReassignRoute = false;
var arrVals;
Ext.refDivID = [];
Ext.arrRefCapStat = [];

function drageanddropzone () {

	Ext.talian.REMOTING_API.enableBuffer = 0;
   	var remotingProvider = Ext.Direct.addProvider( Ext.talian.REMOTING_API);
   	var isReservationLoaded = false ;
   	var isSummaryLoaded = false ;

   	Ext.dsReservation = new Ext.data.DirectStore( {
	    paramsAsHash:false,
	    root:'data',
	    directFn: EditorBean.getReservation,
	    idProperty:'RESERVATIONID',
	    totalProperty:'totalProperty',
	    fields: [
	      {name: 'RESERVATIONID' },
	      {name: 'TRIPDATE' },
	      {name: 'FLIGHTSESSION' },
	      {name: 'RESTYPE' },
	      {name: 'DISPLAYNAME' },
	      {name: 'ORG'},
	      {name: 'DEST'},
	      {name: 'POV'},
	      {name: 'PRIORITY'},
	      {name: 'LUGGAGEWEIGHT'},
	      {name: 'PAXWEIGHT'}
	    ],
	    listeners: {
	      load: function(s, records){
	        textStatus ("Loaded " + records.length + " records", true, false) ;
	      }
	    },
	    baseParams : {
		    reservedate : Ext.cDate,
			flightsession : Ext.flightSessionId,
	        start : 0,
			page : 22
	    },
	    paramOrder: 'reservedate|flightsession|start|page'
    });

    Ext.dsAcreg = new Ext.data.DirectStore( {
	    paramsAsHash:false,
	    root:'data',
	    directFn: DataBean.getMbo,
	    idProperty:'ACREGID',
	    totalProperty:'totalProperty',
	    fields: [
	      {name: 'ACREGID' },
	      {name: 'DESCRIPTION' },
	      {name: 'ACREG' },
	      {name: 'SERIAL' },
	      {name: 'STATUS' },
	      {name: 'EEW'},
	      {name: 'MTOW'},
	      {name: 'TANKCAPACITY'},
	      {name: 'MAXSPEED'},
	      {name: 'PAXCAPACITY'},
	      {name: 'PRESENTATION'},
	      {name: 'PATHCOLOR'}
	    ],
	    listeners: {
	      load: function(s, records){
			textStatus ("Loaded " + records.length + " records", true, false) ;
	      }
	    },
	    baseParams : {
	        start : 0,
	        limit : 10000,
	        sort : "ACREGID",
	        mboname : "ACREG",
	        where : "1=1",
	        dir : "ASC"
	    },
	    paramOrder: 'mboname|where|start|limit|sort|dir'
    });

    Ext.dsAcreg.load();

    var pager = new Ext.PagingToolbar({
        store: Ext.dsReservation,
        displayInfo: true,
        pageSize: 22
      });

    Ext.dsReservation.load() ;

    Ext.patientView = new Ext.grid.GridPanel( {
	    store: Ext.dsReservation,
	    height: 533,
	    stripeRows: true,
	    columns: [
	      {
	        header: 'Name',
	        dataIndex: 'DISPLAYNAME',
	        width: 60
	      },
	      {
	        header: 'Org',
	        dataIndex: 'ORG',
	        sortable: true,
	        width: 25
	      },
	      {
	        header: 'Dest',
	        dataIndex: 'DEST',
	        sortable: true,
	        width: 25
	      },
	      {
	        header: 'POV',
	        dataIndex: 'POV',
	        sortable: true,
	        width: 25
	      }
	    ],
	    bbar:pager,
	    viewConfig: {
        	forceFit:true,
        	tpl: new Ext.XTemplate( '<div class="patient-source"><table><tbody>' +
        		                    '<tr><td class="{clname}">{name}</td><td class="patient-name">{from}</td><td class="patient-name">{to}</td><td class="patient-name">{no}</td></tr>' +
        		                    '</tbody></table></div>' ),
        	cls: 'patient-view',
        	itemSelector: 'div.patient-source',
        	overClass: 'patient-over',
        	selectedClass: 'patient-selected',
        	multiSelect: true
        },
        listeners: {
            render: initializeReservationDragZone
        }
	  }) ;

    Ext.fleetGrid = new Ext.grid.GridPanel({
        title: 'Fleet Assignment',
        region: 'east',
        height: 560,
        margins: '0 2 2 0',
        bbar: [{
            text: 'Scenario',
            handler: function() {
        		Ext.winScenario.show(this);
				var dom = Ext.get('scenarios');
				dom.applyStyles("position:absolute;top:100px;");

				var domShadow = Ext.query('.x-ie-shadow');
				Ext.get(domShadow).applyStyles("top:100px;");
            }
        }, {
        	text: 'Clear',
        	handler: function() {

        		for (var i=0; i<Ext.dsAcreg.data.items.length; i++) {
        			var rec = Ext.dsAcreg.data.items[i] ;
        			EditorBean.clearAssignment(rec.data.name);
        			if (rec.data.assignment) {
        				for (var j=0; j<rec.data.assignment.length; j++) {
        					var recData = rec.data.assignment[j] ;

        					recData.set ("clname","patient-label") ;
        					recData.commit () ;
        				}
        			}

        			rec.data.revassignment = null ;
        			rec.data.assignment = null ;

        			rec.set("fuel", 0) ;
        			rec.set("payload", 0) ;
        			rec.set("svctime","00:00") ;
        			rec.set("assignment", []) ;
        			rec.set("revassignment", []) ;
        			var asdf = generateLoadTable();
        			rec.set("loadtext", asdf) ;
        			rec.commit () ;
        		}
        	}
        }, {
        	text: 'Configuration',
        	handler: function() {
        	}
        }],
        columns: [ {
			dataIndex: ' ',
            header: ' ',
			sortable: false,
            width: 30,
			renderer: renderCraftButton
		}, {
            dataIndex: 'ACREG',
            header: 'Reg No',
            width: 100
        },{
			dataIndex: ' ',
            header: ' ',
			sortable: false,
            width: 150
		}
		],
        viewConfig: {
            tpl: new Ext.XTemplate('<div class="hospital-target" >'+
										'<div style="border:2px solid {PATHCOLOR};width:384px;height:80px;margin:1px;padding:0px">' +
											'<table><tbody><tr>' +
											'<td width="313px">' +
												'<div style="border:1px solid {PATHCOLOR};width:308px;height:75px;margin:0px;padding:1px">' +
													'<table class="{PATHCOLOR}"><tbody>' +
														'{PRESENTATION}'+
													'</tbody></table>' +
												'</div>' +
											'</td>'	+
											'<td>' +
												'<table><tbody><tr><td>' +
													'<div style="border:1px solid ;width:11px;height:11px;margin:0px;padding:0px">' +
													'1</div>' +
												'</td></tr><tr><td>' +
													'<div style="border:1px solid ;width:11px;height:11px;margin:0px;padding:0px">' +
													'1</div>' +
												'</td></tr><tr><td>' +
													'<div style="border:1px solid ;width:11px;height:11px;margin:0px;padding:0px">' +
													'1</div>' +
												'</td></tr>' +
												'</tbody></table>' +
											'</td>' +
											'</tr></tbody></table>' +
										'</div>' +
            		               '</div>', {compiled: true}),
            enableRowBody: true,
            getRowClass: function(rec, idx, p, store) {
                p.body = this.tpl.apply(rec.data);
            }
        },
        store: Ext.dsAcreg,
        listeners: {
            render: initializeHospitalDropZone
        }
    });

    new Ext.Viewport({
        layout: 'border',
        applyTo: 'data1_canvas',
        items: [ {
            title: 'Reservation',
            region: 'west',
            width: 280,
            height: 560,
            margins: '0 0 0 0',
            items: Ext.patientView
        }]
    });

    new Ext.Viewport({
        layout: 'border',
        applyTo: 'data2_canvas',
        items: [ {
        	region: 'center',
        	width: 410,
        	height: 560,
        	margins: '0 0 0 0',
            items: Ext.fleetGrid
        }]
    });
}

function renderCraftButton (value, id, r) {
	var id = Ext.id();
	createGridButton.defer(10, this, ['', id, r]);
    // return('&lt;div id="' + id + '"&gt;&lt;/div&gt;');
	return('<div id="' + id + '"></div>');
}

function createGridButton(value, id, record) {
	new Ext.Button({
		text: value
		,iconCls: 'tabs'
		,handler : function(btn, e) {
			var NOT_ASSIGNED ;
			var assignment = record.data.ACREG ;
            var revassignment = [] ;
            var newassignment = [] ;

			Ext.example.msg('Delete Fleet Assignment', 'Deleting assignment for {0}', record.data.ACREG) ;
			EditorBean.clearAssignment(record.data.ACREG) ;

			record.data.assignment = null ;
			record.data.revassignment = null ;

			record.set("fuel", 0) ;
			record.set("assignment", []) ;
			record.set("revassignment", []) ;
			record.set("PRESENTATION", generateLoadTable()) ;

			record.commit () ;

			Ext.patientView.store.reload() ;
		}
	}).render(document.body, id);
}



/*
 * Here is where we "activate" the DataView.
 * We have decided that each node with the class "patient-source" encapsulates a single draggable
 * object.
 *
 * So we inject code into the DragZone which, when passed a mousedown event, interrogates
 * the event to see if it was within an element with the class "patient-source". If so, we
 * return non-null drag data.
 *
 * Returning non-null drag data indicates that the mousedown event has begun a dragging process.
 * The data must contain a property called "ddel" which is a DOM element which provides an image
 * of the data being dragged. The actual node clicked on is not dragged, a proxy element is dragged.
 * We can insert any other data into the data object, and this will be used by a cooperating DropZone
 * to perform the drop operation.
 */
function initializeReservationDragZone(v) {
    v.dragZone = new Ext.dd.DragZone(v.getEl(), {

//      On receipt of a mousedown event, see if it is within a draggable element.
//      Return a drag data object if so. The data object can contain arbitrary application
//      data, but it should also contain a DOM element in the ddel property to provide
//      a proxy to drag.
        getDragData: function(e) {
            var sourceEl = e.getTarget(v.itemSelector, 10);
            if (sourceEl) {
                d = sourceEl.cloneNode(true);
                d.id = Ext.id();
            	var rowIndex = v.getView().findRowIndex(sourceEl);
                var h = v.getStore().getAt(rowIndex);
				var sm=Ext.patientView.getSelectionModel();
                var sel=sm.getSelections();
                if (sel.length>1)
                	d.innerHTML = '(' + sel.length + ') reservations' ;
                else
                	d.innerHTML = h.data.DISPLAYNAME + '(' + h.data.ORG+ '-' +h.data.DEST + ')' ;

                return v.dragData = {
                    sourceEl: sourceEl,
                    repairXY: Ext.fly(sourceEl).getXY(),
					selections: sel,
                    ddel: d,
                    patientData: h.data,
                    recData: h
                }
            }
        },

//      Provide coordinates for the proxy to slide back to on failed drag.
//      This is the original XY coordinates of the draggable element.
        getRepairXY: function() {
            return this.dragData.repairXY;
        }
    });
}

function switchNextVal(current, rowindex) {
	var currVal = current.parentNode.childNodes[1].innerText;
	var nextVal = current.parentNode.parentNode.nextSibling.childNodes[0].childNodes[1].innerText;

	current.parentNode.childNodes[1].innerText = nextVal;
	current.parentNode.parentNode.nextSibling.childNodes[0].childNodes[1].innerText = currVal;

    var h = Ext.fleetGrid.getStore().getAt(rowindex);
	var vals = current.parentNode.parentNode.parentNode.innerText;

	vals.replace("\t", "");
	vals.replace(" "), "";
	console.log(vals);
	arrVals = vals.split("\n");

	var patt1=/[A-z]/i;
	var i = 0;
	while (i < arrVals.length)
	{
		if(arrVals[i].match(patt1) == null){
			arrVals.splice(i, 1);
		} else {
			i++
		}
	}
	EditorBean.rearrangeRoute(h.data.ACREG,arrVals,function(retval, e) {
		updateFleetAssignment(retval, e, h, rowindex);
	})
}

function switchPrevVal(current, rowindex) {
	var currVal = current.parentNode.childNodes[1].innerText;
	var prevVal = current.parentNode.parentNode.previousSibling.childNodes[0].childNodes[1].innerText;

	current.parentNode.childNodes[1].innerText = prevVal;
	current.parentNode.parentNode.previousSibling.childNodes[0].childNodes[1].innerText = currVal;

	var h = Ext.fleetGrid.getStore().getAt(rowindex);
	var vals = current.parentNode.parentNode.parentNode.innerText;

	vals.replace("\t", "");
	vals.replace(" "), "";
	console.log(vals);
	arrVals = vals.split("\n");

	var patt1=/[A-z]/i;
	var i = 0;
	while (i < arrVals.length)
	{
		if(arrVals[i].match(patt1) == null){
			arrVals.splice(i, 1);
		} else {
			i++
		}
	}
	EditorBean.rearrangeRoute(h.data.ACREG,arrVals,function(retval, e) {
		updateFleetAssignment(retval, e, h, rowindex);
	})
}

function generateLoadTable (rowindex, assignment, fuelarray, fuelneed, paxon, paxoff, cls, pobval, wobval, isrefuelingcap) {
	var tmpl = '<td class="{1}">{0}</td>' ;
	//var tmpl2 = '<td class="{0}"><div id="testref"></div></td>' ;
	var tmplhdr = '<th id="{1}" class="'+cls+'" >'+
	'<ul id="switch">' +
	'	<li id="left" onclick="switchPrevVal(this, {2});">{0}</li>' +
	'	<li id="center"><div id="{3}"></div></li>' +
	'	<li id="right" onclick="switchNextVal(this, {2});"></li></th>' ;
	var tmplhdrnoswitch = '<th id="{1}" class="'+cls+'" >'+
	'<ul id="switch">' +
	'	<li id="noleft" >{0}</li>' +
	'	<li id="center"></li>' +
	'	<li id="noright" ></li></th>' ;
	var tmplhdronlyleft = '<th id="{1}" class="'+cls+'" >'+
	'<ul id="switch">' +
	'	<li id="left" onclick="switchPrevVal(this, {2});">{0}</li>' +
	'	<li id="center"><div id="{3}"></div></li>' +
	'	<li id="noright" ></li></th>' ;
	var tmplhdronlyright = '<th id="{1}" class="'+cls+'" >'+
	'<ul id="switch">' +
	'	<li id="noleft" >{0}</li>' +
	'	<li id="center"><div id="{3}"></div></li>' +
	'	<li id="right" onclick="switchNextVal(this, {2});"></li></th>' ;
	var tmplspc = '<td class="'+cls+'">&nbsp</td>' ;
	var tmplhdrspc = '<th class="'+cls+'">&nbsp</td>' ;
	var fulltext1 = '<tr>' ;
	var fulltext2 = '<tr>' ;
	var fulltext3 = '<tr>' ;
	var fulltext4 = '<tr>' ;
	var fulltext5 = '<tr>' ;
	var assignmentlength = -1 ;

	if (typeof (assignment) != 'undefined')
		assignmentlength = assignment.length ;

	for (var i=0; i<10; i++) {
		if (i<assignmentlength) {
			var dynID = Ext.id();

			if(i==0 || i == assignmentlength-1 || (i==1 && assignmentlength==3)){
				fulltext1 = fulltext1 + String.format(tmplhdrnoswitch, assignment[i], dynID) ;
			}
			else if (i==1 && assignmentlength>3) {
				Ext.refDivID[i] = dynID;
				fulltext1 = fulltext1 + String.format(tmplhdronlyright, assignment[i], dynID, rowindex, Ext.refDivID[i]) ;
				if(isrefuelingcap[i]) {
					Ext.arrRefCapStat[i] = false;
				} else {
					Ext.arrRefCapStat[i] = true;
				}
			}
			else if (i == assignmentlength-2) {
				Ext.refDivID[i] = dynID;
				fulltext1 = fulltext1 + String.format(tmplhdronlyleft, assignment[i], dynID, rowindex, Ext.refDivID[i]) ;
				if(isrefuelingcap[i]) {
					Ext.arrRefCapStat[i] = false;
				}else {
					Ext.arrRefCapStat[i] = true;
				}
			}
			else {
				Ext.refDivID[i] = dynID;
				fulltext1 = fulltext1 + String.format(tmplhdr, assignment[i], dynID, rowindex, Ext.refDivID[i]) ;
				if(isrefuelingcap[i]){
					Ext.arrRefCapStat[i] = false;
				}else {
					Ext.arrRefCapStat[i] = true;
				}
			}
			//fulltext1 = fulltext1 + String.format(tmplhdr, assignment[i], dynID, rowindex) ;
			fulltext2 = fulltext2 + String.format(tmpl, fuelarray[i], cls+wobval[i]) ;
			fulltext3 = fulltext3 + String.format(tmpl, fuelneed[i], cls) ;
			fulltext4 = fulltext4 + String.format(tmpl, paxon[i], cls+pobval[i]) ;
			fulltext5 = fulltext5 + String.format(tmpl, paxoff[i], cls) ;
		}
		else {
			fulltext1 = fulltext1 + tmplhdrspc ;
			fulltext2 = fulltext2 + tmplspc ;
			fulltext3 = fulltext3 + tmplspc ;
			fulltext4 = fulltext4 + tmplspc ;
			fulltext5 = fulltext5 + tmplspc ;
		}
	}

	fulltext1 = fulltext1 + '</tr>' ;
	fulltext2 = fulltext2 + '</tr>' ;
	fulltext3 = fulltext3 + '</tr>' ;
	fulltext4 = fulltext4 + '</tr>' ;
	fulltext5 = fulltext5 + '</tr>' ;

	return fulltext1 + fulltext2 + fulltext3 + fulltext4 + fulltext5 ;
}

ButtonPanel = Ext.extend(Ext.Panel, {
    layout:'table',
    defaultType: 'button',
    baseCls: 'x-plain',
    cls: 'btn-panel',
    renderTo : 'panel',
    menu: menu,
    split: false,

    layoutConfig: {
        columns:1
    },

    constructor: function(desc, buttons){
        // apply test configs
        for(var i = 0, b; b = buttons[i]; i++){
            b.menu = this.menu;
            b.menu.id = this.menu.id;
            b.enableToggle = this.enableToggle;
            b.split = this.split;
            b.arrowAlign = this.arrowAlign;
        }
        var items = buttons;

        ButtonPanel.superclass.constructor.call(this, {
            items: items
        });
    }
});

// This function renders a block of buttons
function renderButtons(title){
    new ButtonPanel(
        'Text Only',
        [{
            text: ''
        }]
    );
}

var menu = new Ext.menu.Menu({
    style: {
        overflow: 'visible'     // For the Combo popup
    },
    items: [
        {
            text: 'Refueling',
            checked: true,       // when checked has a boolean value, it is assumed to be a CheckItem
            checkHandler: onItemCheck
        }
    ]
});

function onItemCheck(item, checked){
    Ext.example.msg('Item Check '+ item.acreg + item.port, 'You {1} the "{0}" menu item.', item.text, checked ? 'checked' : 'unchecked');
	EditorBean.setRefueling(item.record.data.ACREG, item.port, checked, function(retval, e) {
		updateFleetAssignment(retval, e, item.record, item.rowindex);
	})
}

function onItemCheckBefore(item, checked){
	Ext.example.msg('Item Check ', 'You {1} the "{0}" menu item.', item.text, checked ? 'checked' : 'unchecked');
	var currentroute = (item.record.data.assignment.toString().split(','));
	var currentport = item.parentMenu.port;
	var proposedroute = new Array(currentroute.length);
	var found = false;
	for(var i=0; i<currentroute.length; i++){
		if(found == true){
			proposedroute[i+1] = currentroute[i];
		} else if (found == false){
			proposedroute[i] = currentroute[i];
		}
		if(currentroute[i] == currentport){
			found = true;
			proposedroute[i] = item.text;
			proposedroute[i+1] = currentport;
		}
	}

	EditorBean.rearrangeRoute(item.record.data.ACREG, proposedroute, function(retval, e) {
		updateFleetAssignment(retval, e, item.record, item.rowindex);
	})
}

function onItemCheckAfter(item, checked){
    Ext.example.msg('Item Check ', 'You {1} the "{0}" menu item.', item.text, checked ? 'checked' : 'unchecked');
	var currentroute = (item.record.data.assignment.toString().split(','));
	var currentport = item.parentMenu.port;
	var proposedroute = new Array(currentroute.length);
	var found = false;
	for(var i=0; i<currentroute.length; i++){
		if(found == true){
			proposedroute[i+1] = currentroute[i];
		} else if (found == false){
			proposedroute[i] = currentroute[i];
		}
		if(currentroute[i] == currentport){
			found = true;
			proposedroute[i] = currentport;
			proposedroute[i+1] = item.text;
		}
	}

	EditorBean.rearrangeRoute(item.record.data.ACREG, proposedroute, function(retval, e) {
		updateFleetAssignment(retval, e, item.record, item.rowindex);
	})
}

function createRefuelingMenu(record, rowindex) {
	for(var i = 0; i < Ext.refDivID.length; i++){
		if(typeof (Ext.refDivID[i]) != 'undefined'){
			var menurefuelingbefore = new Array(record.data.refuelingports.length);
			var menurefuelingafter = new Array(record.data.refuelingports.length);
			for(var x = 0; x < record.data.refuelingports.length; x++){
				var refuelingitem =  new Ext.menu.CheckItem({
					text: record.data.refuelingports[x],
		            checked: false,
		            checkHandler: onItemCheckBefore,
		            group: 'bef',
		            record: record
				});
				menurefuelingbefore[x] = refuelingitem;
			}

			for(var x = 0; x < record.data.refuelingports.length; x++){
				var refuelingitem =  new Ext.menu.CheckItem({
					text: record.data.refuelingports[x],
		            checked: false,
		            checkHandler: onItemCheckAfter,
		            group: 'nxt',
		            record: record
				});
				menurefuelingafter[x] = refuelingitem;
			}

			ButtonPanel.override({
		        enableToggle: true,
		        menu: new Ext.menu.Menu({
		        		id: Ext.id(),
					    style: {
					        overflow: 'visible'
					    },
					    items: [
					        {
					            text: 'Refueling?',
					            checked: true,
					            record: record,
					            rowindex: rowindex,
					            disabled: Ext.arrRefCapStat[i],
								port: record.data.assignment[i],
					            checkHandler: onItemCheck
					        }, '-',
					        {
					            text: 'Add Refueling Station Before',
					            enableToggle: true,
					            menu: {
					                items: menurefuelingbefore,
					                port: record.data.assignment[i],
					            	rowindex: rowindex,
					                style: {
								        overflow: 'visible'
								    }
					            }
					        }, '-',
					        {
					            text: 'Add Refueling Station After',
					            enableToggle: true,
					            menu: {
					                items: menurefuelingafter,
					                port: record.data.assignment[i],
					            	rowindex: rowindex,
					                style: {
								        overflow: 'visible'
								    }
					            }
					        }
					    ]
					}),
		        renderTo: Ext.refDivID[i],
		        height:5,
		        //renderTo: 'testref',
		        style: {
		            marginBottom: '3px',
		            opacity: 0.5
		        }
		    });
		    renderButtons('Normal Buttons');
		}
    }
}

function updateFleetAssignment(retval, e, record, rowindex) {
	if (typeof (retval) != 'undefined') {
		var result = retval['result'] ;
		var arrScen = ['', retval['scenarioid'], ''];

		if (result)
			Ext.example.msg('Assignment', 'Assignment return route : {0}', result) ;
		var err = retval['err'] ;
		if (err)
			Ext.example.msg('Assignment', 'Assignment return error : {0}', err) ;
		else {
			var ischanged = retval['ischanged'] ;
			record.data.paxon = retval['paxon'] ;
			record.data.paxoff = retval['paxoff'] ;
			record.data.isrefuelingcap = retval['isrefuelingcap'];
			record.data.refuelingports = retval['refuelingports'];

			if (ischanged) {
				record.data.assignment = retval["portname"] ;
				record.data.fuelarray = retval["fuelonboard"] ;
				record.data.fuelneed = retval["fuelneed"] ;
				record.data.pobval = retval["pobvalidity"];
				record.data.wobval = retval["wobvalidity"];
				record.data.fuelval = retval["fuelvalidity"];

				startport = 'SPG' ;

//	            record.data.targetEl = targetEl ;
	            var loadtext = generateLoadTable(rowindex, record.data.assignment, record.data.fuelarray, record.data.fuelneed, record.data.paxon, record.data.paxoff, record.data.PATHCOLOR, record.data.pobval, record.data.wobval, record.data.isrefuelingcap) ;

	            record.data.PRESENTATION = loadtext ;

	            record.commit () ;
			}
			else {
				var loadtext = generateLoadTable(rowindex, record.data.assignment, record.data.fuelarray, record.data.fuelneed, record.data.paxon, record.data.paxoff, record.data.PATHCOLOR, record.data.pobval, record.data.wobval, record.data.isrefuelingcap) ;
	            record.set ("PRESENTATION", loadtext) ;

	            record.commit () ;
			}
			createRefuelingMenu(record, rowindex);
			Ext.patientView.store.reload();
			Ext.cmbScenario.setValue (retval['scenarioid']) ;
		}
	}
}

/*
 * Here is where we "activate" the GridPanel.
 * We have decided that the element with class "hospital-target" is the element which can receieve
 * drop gestures. So we inject a method "getTargetFromEvent" into the DropZone. This is constantly called
 * while the mouse is moving over the DropZone, and it returns the target DOM element if it detects that
 * the mouse if over an element which can receieve drop gestures.
 *
 * Once the DropZone has been informed by getTargetFromEvent that it is over a target, it will then
 * call several "onNodeXXXX" methods at various points. These include:
 *
 * onNodeEnter
 * onNodeOut
 * onNodeOver
 * onNodeDrop
 *
 * We provide implementations of each of these to provide behaviour for these events.
 */
function initializeHospitalDropZone(g) {
    g.dropZone = new Ext.dd.DropZone(g.getView().scroller, {

//      If the mouse is over a target node, return that node. This is
//      provided as the "target" parameter in all "onNodeXXXX" node event handling functions
        getTargetFromEvent: function(e) {
            return e.getTarget('.hospital-target');
        },

//      On entry into a target node, highlight that node.
        onNodeEnter : function(target, dd, e, data){
            Ext.fly(target).addClass('hospital-target-hover');
        },

//      On exit from a target node, unhighlight that node.
        onNodeOut : function(target, dd, e, data){
            Ext.fly(target).removeClass('hospital-target-hover');
        },

//      While over a target node, return the default drop allowed class which
//      places a "tick" icon into the drag proxy.
        onNodeOver : function(target, dd, e, data){
            var rowIndex = g.getView().findRowIndex(target);
            var h = g.getStore().getAt(rowIndex);

            //if (h.data.revassignment[data.patientData.name] >= 0)
            //	return false ;

            return Ext.dd.DropZone.prototype.dropAllowed;
        },

//      On node drop, we can interrogate the target node to find the underlying
//      application object that is the real target of the dragged data.
//      In this case, it is a Record in the GridPanel's Store.
//      We can use the data set up by the DragZone's getDragData method to read
//      any data we decided to attach.
        onNodeDrop : function(target, dd, e, data){
            var rowIndex = g.getView().findRowIndex(target);
            var h = g.getStore().getAt(rowIndex);
            var targetEl = Ext.get(target);

			var sel = data.selections ;
            var org = data.patientData.ORG ;
            var dest = data.patientData.DEST ;
            var resvids = [] ;
            for(i=0;i<sel.length;i++){
            	resvids[i] = sel[i].data.RESERVATIONID ;
            }

    		assignroute() ;

        	function assignroute () {
				var acreg = h.data.ACREG ;
				EditorBean.assignMultiFleetAtEnd(acreg,resvids,function(retval, e) {
					updateFleetAssignment(retval, e, h, rowIndex);
				}) ;
				return ;
			}

			// remove a port from a route
			// port = data.patientData.name
            function removeroute () {
			    var NOT_ASSIGNED ;
				var port1 ;
				var port2 ;
            	var hqidx = h1.data.revassignment[data.patientData.DEST] ;
            	var oldassignment = h1.data.assignment ;

            	h1.data.revassignment = null ;
            	h1.data.assignment = null ;

            	oldassignment.splice (hqidx, 1) ;
            	// rebuild revassignment
            	var revassignment = [] ;
            	var newassignment = [] ;
	            var startport = "SPG" ;

            	for (var i=0; i<oldassignment.length; i++) {
            		revassignment[oldassignment[i].data.DEST] = i ;
            		newassignment[i] = oldassignment[i] ;

	            	if (i<h.data.assignment.length-1)
	            		startport = oldassignment[i].data.DEST ;
            	}

            	oldassignment = null ;

            	h1.data.assignment = newassignment ;
            	h1.data.revassignment = revassignment ;

            	h1.commit () ;
            }
            return true;
        }
    });
}

function reloadRoute(){
	var v = Ext.fleetGrid.getView() ;
	for (var i=0; i<Ext.dsAcreg.data.items.length; i++) {
		var el = v.getRow(i) ;
		var rowIndex = v.findRowIndex(el);
        var h = Ext.dsAcreg.getAt(rowIndex);

		EditorBean.loadRoute(h.data.ACREG,rowIndex,function(retval, e) {
			var idx = retval["rowindex"] ;
			var h1 = Ext.dsAcreg.getAt(idx);
			updateFleetAssignment(retval, e, h1, idx);
		})
	}
	Ext.dsReservation.reload();
}

Ext.onReady(function(){
	Ext.talian.REMOTING_API.enableBuffer = 0;
   	var remotingProvider = Ext.Direct.addProvider( Ext.talian.REMOTING_API);

   	Djn.RemoteCallSupport.addCallValidation(remotingProvider);
    Djn.RemoteCallSupport.validateCalls = true;

    Ext.portarray = new Array();

    Ext.winScenario = new Ext.Window({
        applyTo:'scenarios',
        layout:'fit',
        position:'absolute',
		width:500,
        height:300,
		top:400,
        closeAction:'hide',
        plain: true,

        items: new Ext.TabPanel({
            applyTo: 'hello-tabs',
            autoTabs:true,
            activeTab:0,
            deferredRender:false,
            border:false
        }),

        buttons: [{
            text:'Select',
			handler: function(){
					EditorBean.assignPing('PK-AAA','RESV1234',function(result, e) {
						var s123 = result['123'] ;
						var s180 = result['180'] ;
						alert('result = ' + s123 + '-' +s180) ;
					}) ;
			}
        },{
            text: 'Close',
            handler: function(){
        		try {
        			Ext.winScenario.hide();
        		}
        		catch (e) {
        			console.log ("Error : " + e) ;
        		}
            }
        }]
    });

    drageanddropzone() ;
    reloadRoute.defer(1000);
 });

 