/**********************************************************************
 * 
 * Code generated automatically by DirectJNgine
 * Copyright (c) 2009, Pedro Agulló Soliveres
 * 
 * DO NOT MODIFY MANUALLY!!
 * 
 **********************************************************************/

Ext.namespace( 'Ext.talian');

Ext.talian.PROVIDER_BASE_URL=window.location.protocol + '//' + window.location.host + '/' + (window.location.pathname.split('/').length>2 ? window.location.pathname.split('/')[1]+ '/' : '')  + 'djn/directprovider';

Ext.talian.POLLING_URLS = {
  log : Ext.talian.PROVIDER_BASE_URL + '/poll/log' /* () => String -- calls com.talian.beans.schedulling.SchedullingBean.handleMessagePoll */
}

Ext.talian.REMOTING_API = {
  url: Ext.talian.PROVIDER_BASE_URL,
  type: 'remoting',
  actions: {
    EditorBean: [
      {
        name: 'assignFleetAtEnd'/*(String, Integer) => java.util.Map */,
        len: 2,
        formHandler: false
      },
      {
        name: 'clearAssignment'/*(String) => java.util.Map */,
        len: 1,
        formHandler: false
      },
      {
        name: 'assignPing'/*(String, String) => java.util.Map */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getRoute'/*(String) => java.util.Map */,
        len: 1,
        formHandler: false
      },
      {
        name: 'cleanUp'/*() => void */,
        len: 0,
        formHandler: false
      }
    ],
    SchedullingBean: [
      {
        name: 'handleSubmit'/*() => com.talian.beans.schedulling.SchedullingBean$Result -- FORM HANDLER */,
        len: 1,
        formHandler: true
      }
    ],
    DataBean: [
      {
        name: 'getMbo'/*(String, String, int, int, String, String) => java.util.Map */,
        len: 6,
        formHandler: false
      }
    ]
  }
}

