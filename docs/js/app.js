App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,
  loading: false,

  init: function() {    
    $(document).ready(function(){
      $("#login").modal();
    })
    return App.initWeb3();
  },

  initWeb3: function() {
    // initialize web3
    if(typeof web3 !== 'undefined') {
      //reuse the provider of the Web3 object injected by Metamask
      App.web3Provider = web3.currentProvider;
    } else {
      //create a new provider and plug it directly into our local node
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    App.displayAccountInfo();
    return App.initContract();
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        App.account = account;
        $('#account').text(account);
        web3.eth.getBalance(account, function(err, balance) {
          if(err === null) {
            $('#accountBalance').text(web3.fromWei(balance, "ether") + " ETH");
          }
        })
      }
    });
  },
  initContract: function() {
    $.getJSON('Session.json', function(sessionArtifact) {
      // get the contract artifact file and use it to instantiate a truffle contract abstraction
      App.contracts.Session = TruffleContract(sessionArtifact);
      // set the provider for our contracts
      App.contracts.Session.setProvider(App.web3Provider);
      // listen to events
      App.listenToEvents();
      // retrieve the article from the contract
      return App.reloadArticles();
    });
  },

  reloadArticles: function() {
    if(App.loading) {
      return;
    }
    App.loading = true;
    App.displayAccountInfo();
    var sessionInstance;
    App.contracts.Session.deployed().then(function(instance){
     sessionInstance = instance;
     return sessionInstance.addData();
     }).then(function(){
      return sessionInstance.getLengthItems().then(function(lengthItems){
        $('#articlesRow').empty();
        $('#addressRow').empty();
        for(var i = 0; i < lengthItems.toNumber(); i++) {
          sessionInstance.itemsList(i).then(function(article){
            return sessionInstance.convertStateToString(article[0]).then(function(statusOfSession){
                sessionInstance.admin().then(function(adminAccount){
                if(adminAccount.toString() == $('#account').text().toString()){
                  $("#nameAccount").hide();
                  $("#listAccount").show();
                  $(".btn-create-new-product").show();
                }else{
                  $("#listAccount").hide();
                  $("#nameAccount").show();
                  $(".btn-create-new-product").hide();
                }
                App.displayArticle(article[0], article[1], article[2], article[4], article[3], article[5], article[6], statusOfSession, adminAccount);
                App.loading = false;
              })
            })
          });
        }
      }).then(function() {
        return sessionInstance.getAddressUserRegister().then(function(addressArray){
          for(var i = 0; i < addressArray.length; i++) {
            console.log(addressArray[i]);
            App.displayAddressUser(addressArray[i]);
          }
        })
      })
    }).catch(function(err) {
      App.loading = false;
    });
  },

  displayAddressUser: function(addressAccountUser) {
    var addressRow = $('#addressRow');
    var addressTemplate = $("#addressTemplate");
    addressTemplate.find('.addressUser').text(addressAccountUser);
    addressTemplate.find('.addressUser').attr('data-id', addressAccountUser)
    addressRow.append(addressTemplate.html());
  },
  openListAddressPriceOfSession: function() {
    event.preventDefault();
    var _addressAccountUser = $(event.target).data('id');
    App.contracts.Session.deployed().then(function(instance){
        instance.paticipants(_addressAccountUser).then(function(paticipant){
        $("#addressDetailAccount").val(paticipant[0]);
        $("#fullNameDetailAccount").val(paticipant[1]);
        $("#gmailDetailAccount").val(paticipant[2]);
        $("#passwordDetailAccount").val(paticipant[3]);
        $("#countPricedSesstion").val(paticipant[4]); 
      })
    })
    $("#detailAccount").modal();
  },
  displayArticle: function(id, name, image, description, price, countPaticipantJoinSesstion, priceProposal, statusOfSession, adminAccount) {
    var articlesRow = $('#articlesRow');
    var articleTemplate = $("#articleTemplate");
    articleTemplate.find('.panel-title').text(name);
    articleTemplate.find('.panel_image').attr('src',"http://localhost:8080/ipfs/"+image)
    articleTemplate.find('.article-description').html(description);
    articleTemplate.find('.article-price').text(price);
    articleTemplate.find('.article-countParticipant').text(countPaticipantJoinSesstion);
    articleTemplate.find('.article-priceProposal').text(priceProposal);
    articleTemplate.find('.article-statusOfSession').text(statusOfSession);
    articleTemplate.find('.btn-start').attr('data-id', id);
    articleTemplate.find('.btn-change-price').attr('data-id', id);
    articleTemplate.find('.btn-checkTime').attr('data-id', id);
    articleTemplate.find('.btn-change-final-price').attr('data-id', id);
    articleTemplate.find('.btn-stop').attr('data-id', id);
    articleTemplate.find('.btn-show-deviation').attr('data-id', id);
    // add this new article
    if(adminAccount.toString() == $('#account').text().toString()){
      articleTemplate.find('.btn-start').show();
      articleTemplate.find('.btn-change-price').hide();
      articleTemplate.find('.btn-checkTime').hide();
    }else{
      articleTemplate.find('.btn-start').hide();
      articleTemplate.find('.btn-checkTime').show();
    }
    
    if(statusOfSession.toString() != "Not Start" && statusOfSession.toString() != "Ending" && adminAccount.toString() != $('#account').text().toString()){
      articleTemplate.find('.btn-start').hide();
      articleTemplate.find('.btn-checkTime').show();
      articleTemplate.find('.btn-change-price').show();
    }else{
      articleTemplate.find('.btn-change-price').hide();
    }

    if(statusOfSession.toString() == "Started" && adminAccount.toString() == $('#account').text().toString()){
      articleTemplate.find('.btn-start').hide();
    }

    if(statusOfSession.toString() == "Ending" && adminAccount.toString() == $('#account').text().toString()){
      articleTemplate.find('.btn-start').hide();
      articleTemplate.find('.btn-change-final-price').show();
    }else{
      articleTemplate.find('.btn-change-final-price').hide();
    }
    
    if(statusOfSession.toString() == "Started" && adminAccount.toString() == $('#account').text().toString()){
      articleTemplate.find('.btn-stop').show();    
    }else{
      articleTemplate.find('.btn-stop').hide();
    }

    
    if(statusOfSession.toString() == "Done" && adminAccount.toString() == $('#account').text().toString()){
      articleTemplate.find('.btn-finish').show();
      articleTemplate.find('.btn-show-deviation').show();
      articleTemplate.find('.btn-start').hide();
      articleTemplate.find('.btn-change-final-price').hide();
    }else{
      articleTemplate.find('.btn-finish').hide();
      articleTemplate.find('.btn-show-deviation').hide();
    }

    if(statusOfSession.toString() == "Done" && adminAccount.toString() != $('#account').text().toString()){
      articleTemplate.find('.btn-checkTime').hide();
      articleTemplate.find('.btn-change-price').hide();
      articleTemplate.find('.btn-change-final-price').hide();
      articleTemplate.find('.btn-finish').show();
    }
    
    if(statusOfSession.toString() == "Started" && adminAccount.toString() != $('#account').text().toString()){
      articlesRow.append(articleTemplate.html());
    }
    if(adminAccount.toString() == $('#account').text().toString()){
      articlesRow.append(articleTemplate.html());
    }
  },

  createNewAccount: function(){
    var _nameProduct = $("#nameProduct").val();
    var _hashImageOfProduct = $("#hashImageOfProduct").val();
    var _infomationOfProduct = $("#infomationOfProduct").val();
    var _priceOfProduct = $("#priceOfProduct").val();
    if(_nameProduct.trim() != "" && _hashImageOfProduct.trim() != "" && _infomationOfProduct.trim() != "" && _priceOfProduct.trim() != "" ){
      App.contracts.Session.deployed().then(function(instance){
        instance.admin().then(function(adminAccount){
          return instance.createNewItem(_nameProduct, _hashImageOfProduct, _infomationOfProduct, _priceOfProduct, {from: adminAccount, gas: 5000000}).then(function(){
            App.reloadArticles();
          })
        })
      })
    }else{
      alert("Don't empty the box input\nPlease!Check the box input")
    }
    
  },

  loginAccount: function(){  
    var _emailLogin = $("#emailLogin").val();
    var _passwordLogin = $("#passwordLogin").val();
    if(_emailLogin.trim() != "" && _passwordLogin.trim() != ""){
       if(_emailLogin.indexOf("@") > -1){
        if(_passwordLogin.length >= 8){
          App.contracts.Session.deployed().then(function(instance){
            instance.paticipants($('#account').text()).then(function(paticipant){
              if(_emailLogin == paticipant[2]){
                 if(_passwordLogin == paticipant[3]){
                  $('#login').modal('hide');
                  $("#nameAccount").text(paticipant[1]);
                  
                 }else{
                  alert("Password not match\nPlease!Check the box input")
                 }
              }else{
                alert("Email not exist\nPlease! Click sign up to register a new account")
              }
            })
          })
        }else{
          alert("Length of password great equal then 8 \nPlease!Check the box input")
        }
       }else{
        alert("Wrong email\nPlease!Check the box input")
       }
    }else{
      alert("Don't empty the box input\nPlease!Check the box input")
    }
  },

  registerAccount: function(){
    var _fullNameRegsiter = $("#fullNameRegsiter").val();
    var _gmailRegsiter = $("#gmailRegsiter").val();
    var _passwordRegsiter = $("#passwordRegsiter").val();
    var _rePasswordRegsiter = $("#rePasswordRegsiter").val();
    if(_fullNameRegsiter.trim() != "" && _gmailRegsiter.trim() != "" && _passwordRegsiter.trim() != "" && _rePasswordRegsiter.trim() != ""){
      if(_passwordRegsiter == _rePasswordRegsiter){
        if(_gmailRegsiter.indexOf("@") > -1){
          if(_passwordRegsiter.length >= 8){
            App.contracts.Session.deployed().then(function(instance){
                return instance.registerAccount($('#account').text(), _fullNameRegsiter, _gmailRegsiter, _passwordRegsiter).then(function(){
                    $('#sign-up').modal('hide');
                    instance.paticipants($('#account').text()).then(function(paticipant){
                    $("#nameAccount").text(_fullNameRegsiter);
                  
                  })
                }).then(function(result) {
       
                }).catch(function(err) {
                  $('#sign-up').modal('hide');
                  alert("This address Really existed\nPlease! Choose an other account")
                });  
              })
          }else{
            alert("Length of password great equal then 8 \nPlease!Check the box input")
          }
        }else{
          alert("Wrong email\nPlease!Check the box input")
        }
      }else{
        alert("Password not match\nPlease!Check the box input")
      }
    }else{
      // alert("So Ok");
      // $('#sign-up').modal('hide')
      alert("Don't empty the box input\nPlease!Check the box input")
    }
  },


  startSessions: function(){
    event.preventDefault();
    var _Iditems = $(event.target).data('id');
    App.contracts.Session.deployed().then(function(instance){
      return instance.admin().then(function(adminAccount){
        return instance.startSesstion(_Iditems, {
          from: adminAccount,
          gas: 5000000
        });
      })
    }).catch(function(error) {
      console.error(error);
    });
  },


  showDetailAccount: function(){
    var _nameAccount = $("#nameAccount").text();
    if(_nameAccount.trim() != "Full Name"){
      App.contracts.Session.deployed().then(function(instance){
          instance.paticipants($('#account').text()).then(function(paticipant){
          $("#addressDetailAccount").val(paticipant[0]);
          $("#fullNameDetailAccount").val(paticipant[1]);
          $("#gmailDetailAccount").val(paticipant[2]);
          $("#passwordDetailAccount").val(paticipant[3]);
          $("#countPricedSesstion").val(paticipant[4]); 
        })
      })
      $("#detailAccount").modal();
    }else{
      $("#login").modal();
    }
  },

  listenToEvents: function(){
    App.contracts.Session.deployed().then(function(instance){
      instance.LogStartSession({}, {}).watch(function(error, event){
        if(!error){
          $("#events").append('<li class="list-group-item">' + event.args._nameItem + ' is  started for changing price</li>');
        }else {
          console.error(error);
        }
        App.reloadArticles();
      });

      instance.LogStopSession({}, {}).watch(function(error, event){
        if(!error){
          $("#events").append('<li class="list-group-item">' + event.args._nameItem + ' was stop for change price</li>');
        }else {
          console.error(error);
        }
        App.reloadArticles();
      });

      instance.LogChainPriceOfSession({}, {}).watch(function(error, event){
        if(!error){
          $("#events").append('<li class="list-group-item">' + event.args._fullName + ' offer new price for '+event.args._nameItem+'</li>');
        }else {
          console.error(error);
        }
        App.reloadArticles();
      });
    })
  },

  checkStatusOfSession: function() {
    event.preventDefault();
    var _Iditems = $(event.target).data('id');
    App.contracts.Session.deployed().then(function(instance){
      instance.admin().then(function(adminAccount){
        if(adminAccount.toString() == $('#account').text().toString()){
         return instance.timeOutOfSesstion(_Iditems).then(function(){
            return instance.convertStateToString(_Iditems).then(function(statusOfSession){
              alert(statusOfSession);
            })
          })
        }else{
          if($("#nameAccount").text() == "Full Name"){
            $("#login").modal();
          }else{
              return instance.timeOutOfSesstion(_Iditems).then(function(){
                return instance.convertStateToString(_Iditems).then(function(statusOfSession){
                  alert(statusOfSession);
                  if(statusOfSession == "Ending"){
                    return instance.getProposedPrice(_Iditems).then(function(){
                      App.reloadArticles();
                    })
                  }
                })
              })
          }
        }
      })
    })
  },
  openChangingPriceOfSession: function() {
    event.preventDefault();
    var _Iditems = $(event.target).data('id');
      if($("#nameAccount").text() == "Full Name"){
        $("#login").modal();
      }else{
        $("#idItemsOfSession").val(_Iditems);
        $("#changingPrice").modal();
      }
  },

  openChangingFinalPriceOfSession: function() {
    event.preventDefault();
    var _Iditems = $(event.target).data('id');
    $("#idItemsOfSessionFinal").val(_Iditems);
    $("#changingPriceFinal").modal();
  },

  openStopSession: function() {
    event.preventDefault();
    var _Iditems = $(event.target).data('id');
    $("#idItemsOfSessionStop").val(_Iditems);
    $("#stopSession").modal();
  },

  changingPriceOfSession: function(){
    var _Iditems = $("#idItemsOfSession").val();
    var _newPriceOfSession = $("#newPriceOfSession").val();
    var accountOfSession = $('#account').text().toString();
    if(_newPriceOfSession.trim() != ""){
      App.contracts.Session.deployed().then(function(instance){
        return instance.accumulatedDeviation(_newPriceOfSession, _Iditems,{
          from: accountOfSession,
          gas: 5000000
        })
      })
    }else{
      alert("Don't empty the box input\nPlease!Check the box input");
    }
  },

  changingFinalPriceOfSession: function(){
    var _Iditems = $("#idItemsOfSessionFinal").val();
    var _newPriceOfSessionFinal = $("#newPriceOfSessionFinal").val();
    if(_newPriceOfSessionFinal.trim() != ""){
      App.contracts.Session.deployed().then(function(instance){
        instance.admin().then(function(adminAccount){
          return instance.setFinalPriceOfItem(_Iditems, _newPriceOfSessionFinal,{
            from: adminAccount,
            gas: 5000000
          }).then(function(){
            App.reloadArticles();
          })
        })
      })
    }else{
      alert("Don't empty the box input\nPlease!Check the box input");
    }
  },

  stopSession: function(){
    var _Iditems = $("#idItemsOfSessionStop").val();
    App.contracts.Session.deployed().then(function(instance){
      instance.admin().then(function(adminAccount){
        return instance.stopSesstion(_Iditems, {
          from: adminAccount,
          gas: 5000000
        }).then(function(){
          return instance.getProposedPrice(_Iditems, {gas: 5000000}).then(function(){
            App.reloadArticles();
          })
        })
      })
    })
  },

  showDeviation: function(){
    event.preventDefault();
    $(".priceDeviationLeft").text("");
    $(".priceDeviationRight").text("");
    var _Iditems = $(event.target).data('id');
    App.contracts.Session.deployed().then(function(instance){
      instance.itemsList(_Iditems).then(function(article){
        $("#nameProductDeviation").text(article[1]);
         instance.getAddressChangedPriceOfItems(_Iditems).then(function(addressArray){ 
          for(var i = 0 ; i < addressArray.length ; i++){
              instance.paticipants(addressArray[i]).then(function(paticipant){
                $(".priceDeviationLeft").html( $(".priceDeviationLeft").html() + "<strong>Full name: "+paticipant[1] +"</strong></br>")
                $(".priceDeviationRight").html( $(".priceDeviationRight").html()  +"</br>")
              })              
              instance.showDataPrice(_Iditems, addressArray[i]).then(function(arrayPrice){
                for(var j = 1 ; j < arrayPrice.length ; j++){
                  $(".priceDeviationLeft").html( $(".priceDeviationLeft").html() + "Price changed : $"+arrayPrice[j] +"</br>")
                }
              })
              instance.showDataDeviation(_Iditems, addressArray[i]).then(function(arrayDeviation){
                for(var j = 1 ; j < arrayDeviation.length ; j++){
                  $(".priceDeviationRight").html( $(".priceDeviationRight").html() + "Current deviation: "+arrayDeviation[j] +"%</br>")
                }
              })
          }
        })
        $("#showDevition").modal();
      })
    }) 
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});