App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,
  loading: false,

  init: function() {    
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
      //App.listenToEvents();
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
        for(var i = 0; i < lengthItems.toNumber(); i++) {
          sessionInstance.itemsList(i).then(function(article){
            return sessionInstance.convertStateToString(article[0]).then(function(number){
              return sessionInstance.admin().then(function(adminAccount){
                App.displayArticle(article[0], article[1], article[2], article[4], article[3], article[5], article[8], number, adminAccount);
                App.loading = false;
              })
            })
          });
        }
      })
    }).catch(function(err) {
      App.loading = false;
    });
    //getLengthItems
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
    articleTemplate.find('.btn-buy').attr('data-id', id);
    // add this new article

    if(adminAccount.toString() == $('#account').text().toString()){
      articleTemplate.find('.btn-start').show();
      articleTemplate.find('.btn-change-price').hide();
    }else{
      articleTemplate.find('.btn-start').hide();
      articleTemplate.find('.btn-change-price').show();
    }
    articlesRow.append(articleTemplate.html());
  },
  
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
