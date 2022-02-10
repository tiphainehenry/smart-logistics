import React from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';
import '../css/boosted.min.css';

import TenderManager from '../contracts/TenderManager.json';
import getWeb3 from '../getWeb3';

import Header from "./Header";
import FHERequestCmp from "./FHERequestCmp";

import ReactGA from 'react-ga';

import ipfs from '../ipfs';

ReactGA.initialize('UA-186881152-2');
ReactGA.pageview(window.location.pathname + window.location.search);

class FHERequest extends React.Component {

  constructor(props){
    super(props);
    this.state = {

      web3: null,
      accounts: null,
      contract: null, 

      c_key:'',
      c_offer:'',

      tenderName:'',
      newTenderName:'',
      tenderList:[],
      myTenderChoice:'',

      offers:[],

      balance:'',
      provableAddress: "0x015a15fc6c86C9082EF04A5f974E5da098E6b543", // for ganache


      file: null,
      buffer: '',
      ethAddress: '',
      blockNumber: '',
      transactionHash: '',
      gasUsed: '',
      txReceipt: '',

      RSAofferfileReader:null,
      RSAofferfileName:'Input file',
      RSApk: JSON.parse(localStorage.getItem('RSApk')) || null,
      RSApk_fromSC:'',

      AESofferfileReader:null,
      AESofferfileName:'Input file',
      c_offer: JSON.parse(localStorage.getItem('c_offer')) || null,

      AESkeyfileReader: null,
      AESkeyfileName:'Input file',      
      c_key: JSON.parse(localStorage.getItem('c_key')) || null,

      urlTest: ''


      
    };

    this.FundContract = this.FundContract.bind(this);

    this.handleCKey = this.handleCKey.bind(this);
    this.handleCOffer = this.handleCOffer.bind(this);
    this.handleTenderName = this.handleTenderName.bind(this);
    this.handleRSApk = this.handleRSApk.bind(this);
    this.handleTenderChoice = this.handleTenderChoice.bind(this); 
    this.registerSC = this.registerSC.bind(this);
    this.launchComparison = this.launchComparison.bind(this);
    this.cmptTenderList = this.cmptTenderList.bind(this); 
    this.handleNewTenderName = this.handleNewTenderName.bind(this);
    this.registerRSApk = this.registerRSApk.bind(this);

    this.onRSAkeyChange = this.onRSAkeyChange.bind(this);
    this.handleRSAkeyFileRead = this.handleRSAkeyFileRead.bind(this);
    this.onIPFSSubmitRSAkey = this.onIPFSSubmitRSAkey.bind(this);

    this.onAESkeyChange = this.onAESkeyChange.bind(this);
    this.handleAESkeyFileRead = this.handleAESkeyFileRead.bind(this);
    this.onIPFSSubmitAESkey = this.onIPFSSubmitAESkey.bind(this);

    this.onAESofferChange = this.onAESofferChange.bind(this);
    this.handleAESofferFileRead = this.handleAESofferFileRead.bind(this);
    this.onIPFSSubmitAESoffer = this.onIPFSSubmitAESoffer.bind(this);

    this.getURLtest = this.getURLtest.bind(this); 

  };

  componentDidMount = async () => {
    try {  

      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TenderManager.networks[networkId];
      const instance = new web3.eth.Contract(
        TenderManager.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ web3, accounts, contract: instance });


      /// Check oracle balance
      var TenderManager_address = instance.options.address;
      const balance = await this.state.web3.eth.getBalance(this.state.provableAddress);
      this.setState({'balance': balance, provableAddress: TenderManager_address});
      console.log('Current Oracle balance is '+ balance.toString());

      var RSApk_fromSC = await instance.methods.getRSApk().call();
      this.setState({RSApk_fromSC:RSApk_fromSC});



      this.cmptTenderList();
    } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
    };

  }

  async getURLtest(){
    
    try{
      var urlTest = await this.state.contract.methods.getURLTest('test').send({
        from: this.state.accounts[0]}).then(output=>{
          console.log(output);
      })

      console.log(urlTest);
      this.setState({urlTest:urlTest});

    }
    catch(error){
        console.log(error);
    }



  }

  async cmptTenderList(){
          /// retrieve tender list
          var tenderList = await this.state.contract.methods.getTenders().call();

          var offers=[]
          for(var i=0;i<tenderList.length;i++){
            var new_item = [];
            
            var offers_i = await this.state.contract.methods.getOffers(tenderList[i]).call();
    
            if(offers_i.includes(',')){
              offers_i = offers_i.split('},{');
              for (var l=0;l<offers_i.length;l++){
                 new_item.push(offers_i[l].replace('{','').replace('},','').replace('}','').replace(',',',  '));
              }
            }
            offers.push(new_item);
          }
    
          this.setState({
            tenderList:tenderList,
            offers:offers
          });
    
    
  }
  handleCOffer = (e) =>{
    e.preventDefault();
    this.setState({c_offer:e.target.value});
  }

  handleCKey (e){
    e.preventDefault();
    this.setState({c_key:e.target.value});
  }

  handleTenderName (e){
    e.preventDefault();
    this.setState({tenderName:e.target.value});
  }
  handleNewTenderName (e){
    e.preventDefault();
    this.setState({newTenderName:e.target.value});
  }
  
  handleTenderChoice(e){
    e.preventDefault();
    this.setState({myTenderChoice:e.target.value});
  }

  handleRSApk(e){
    e.preventDefault();
    this.setState({RSApk:e.target.value});
  }

  async registerSC(){
    console.log('register sc');

    await this.state.contract.methods.newTender(         
      this.state.newTenderName
    ).send({
      from: this.state.accounts[0]
    });


    var tenderList = await this.state.contract.methods.getTenders().call();
    this.setState({tenderList:tenderList});

  }

  async registerRSApk(){
    console.log('register RSA pk');

    await this.state.contract.methods.setRSApk(         
      this.state.RSApk
    ).send({
      from: this.state.accounts[0]
    });


    var RSApk = await this.state.contract.methods.getRSApk().call();
    this.setState({RSApk_fromSC:RSApk});

  }

  async launchComparison(){
    await this.state.contract.methods.askOracleComparison(         
      this.state.tenderName
    ).send({
      from: this.state.accounts[0]
    });


  }
  async FundContract(){
    const balance = await this.state.web3.eth.getBalance('0x015a15fc6c86C9082EF04A5f974E5da098E6b543');
    console.log('Current balance is '+ balance.toString());

    await this.state.web3.eth.sendTransaction({
        from: "0x89033bC8f73Ef5b46CCb013f6F948b00954a06BB",
        to: "0x015a15fc6c86C9082EF04A5f974E5da098E6b543",
        value: this.state.web3.utils.toWei('1', 'ether'),
        data: this.state.accounts[0]
          })
  }

  onIPFSSubmitRSAkey = async (event) => {
    event.preventDefault();

    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 

    var input = this.state.RSAkeyFileValue;

    try{
        ipfs.files.add(Buffer.from(JSON.stringify(input)))
        .then(res => {
          const hash = res[0].hash
  
          this.setState({
            RSApk: hash
          }, () => {
            localStorage.setItem('RSApk', JSON.stringify(this.state.RSApk))
          });
  
          return ipfs.files.cat(hash)
        })
        .then(output => {
          console.log(JSON.parse(output));
          alert('Saved to IPFS')
        })
      }
      catch(error){
        alert('Is the VPN on?');
      }   

  }; //onIPFSSubmit 


  onIPFSSubmitAESkey = async (event) => {
    event.preventDefault();

    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 

    var input = this.state.AESkeyFileValue;

    try{
        ipfs.files.add(Buffer.from(JSON.stringify(input)))
        .then(res => {
          const hash = res[0].hash
  
          this.setState({
            c_key: hash
          }, () => {
            localStorage.setItem('c_key', JSON.stringify(this.state.c_key))
          });
  
          return ipfs.files.cat(hash)
        })
        .then(output => {
          console.log(JSON.parse(output));
          alert('Saved to IPFS')
        })
      }
      catch(error){
        alert('Is the VPN on?');
      }   

  }; //onIPFSSubmit 



  onIPFSSubmitAESoffer = async (event) => {
    event.preventDefault();

    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 

    var input = this.state.AESofferFileValue;

    try{
        ipfs.files.add(Buffer.from(JSON.stringify(input)))
        .then(res => {
          const hash = res[0].hash
  
          this.setState({
            c_offer: hash
          }, () => {
            localStorage.setItem('c_offer', JSON.stringify(this.state.c_offer))
          });
  
          return ipfs.files.cat(hash)
        })
        .then(output => {
          console.log(JSON.parse(output));
          alert('Saved to IPFS')
        })
      }
      catch(error){
        alert('Is the VPN on?');
      }   

  }; //onIPFSSubmit 

    /**
   * get the file value 
   */
     handleRSAkeyFileRead = (e) => {
      const content = this.state.RSAkeyfileReader.result;
      const res = content.split('\n')
      this.setState({ RSAkeyFileValue: res });
    };

  /**
   * get the file value 
   */
  handleAESkeyFileRead = (e) => {
          const content = this.state.AESkeyfileReader.result;
          const res = content.split('\n')
          this.setState({ AESkeyFileValue: res });
        };

  /**
   * get the file value 
   */
  handleAESofferFileRead = (e) => {
    const content = this.state.AESofferfileReader.result;
    const res = content.split('\n')
    this.setState({ AESofferFileValue: res });
  };

  /**
   * updates filepath on new upload.
   * @param e upload event
   */
   onRSAkeyChange(e) {
    this.setState({ 
      file: e.target.files[0],
      RSAkeyfileName: e.target.files[0]['name'] })

    var RSAkeyfileReader = new FileReader();
    this.setState({ RSAkeyfileReader: RSAkeyfileReader });
    RSAkeyfileReader.onloadend = this.handleRSAkeyFileRead;
    RSAkeyfileReader.readAsText(e.target.files[0]);
  }

  /**
   * updates filepath on new upload.
   * @param e upload event
   */
   onAESkeyChange(e) {
    this.setState({ 
      file: e.target.files[0],
      AESkeyfileName: e.target.files[0]['name'] })

    var AESkeyfileReader = new FileReader();
    this.setState({ AESkeyfileReader: AESkeyfileReader });
    AESkeyfileReader.onloadend = this.handleAESkeyFileRead;
    AESkeyfileReader.readAsText(e.target.files[0]);
  }

    /**
   * updates filepath on new upload.
   * @param e upload event
   */
    onAESofferChange(e) {
      this.setState({ 
        file: e.target.files[0],
        AESofferfileName: e.target.files[0]['name'] 
      })
  
      var AESofferfileReader = new FileReader();
      this.setState({ AESofferfileReader: AESofferfileReader });
      AESofferfileReader.onloadend = this.handleAESofferFileRead;
      AESofferfileReader.readAsText(e.target.files[0]);
    }
  
  render(){
    
    return <div>
    <Header/>
    <div className="discovery-module-one-pop-out py-5 py-lg-3">
    <div className="container">

    <h1>Blind Allocation Smart-Contract.</h1> 
    <hr/><br/>

    <h3>[Tender Initiator] RSA public key (SC hash => {this.state.RSApk_fromSC}).</h3>

    <Form>

    <Form.Group controlId="formBasicEmail">
        <Row>
          <Col>
            <h6>Set/reset RSA public key hash: </h6>
            <p>{this.state.RSApk}</p> 
          </Col>
          <Col>
            <Form.Label className="is-required">Upload file</Form.Label>
            <div class="custom-file">
              <form>
                <input type="file" class="custom-file-input" id="exampleInputFile" onChange={this.onRSAkeyChange} aria-describedby="helpTextFile" />
                <label class="custom-file-label" for="exampleInputFile">{this.state.RSAkeyfileName}</label>
              </form>
            </div>
          </Col>
          <Col>
            <Button className="is-required" onClick={this.onIPFSSubmitRSAkey}>Save RSA pub key to IPFS</Button>
            <span class="form-text small text-muted" id="helpTextFile">Using infura ipfs storage.</span>
          </Col>
      </Row>

      </Form.Group>
      <Button onClick={this.registerRSApk}>+</Button>

    </Form>  

    <hr/><br/>
    <hr/><br/>

    <h3>Registered Tenders</h3>

    <div>
    <Row key="header">
            <Col ><h5>Name</h5></Col>
            <Col ><h5>Offers</h5></Col>
            <Col ><h5>Status</h5></Col>
            </Row>

    {this.state.tenderList.map((name, index) => {

        return (
          
          <Row key={name}>
            <Col ><h5>{name}</h5></Col>
            <Col>
              <ol>
                {(typeof this.state.offers[index] != "undefined")?
                this.state.offers[index].map((subItems, sIndex) => {
                  return <li key={sIndex}> {subItems} </li>;
                }):<></>}
              </ol>
            </Col>
            <Col>NA</Col>

          </Row>

        );
      })}


    </div>

    <hr/><hr/><br/>




    <h3>[Tender Initiator] Create a new tender.</h3>

    <Form>
    <Form.Group controlId="formBasicEmail">
      <Row>
        <Col>
      <Form.Control onChange={this.handleNewTenderName} value={this.state.newTenderName}  placeholder={'enter the tender name'}/>
      </Col>
      <Col>
      <Button onClick={this.registerSC}>+</Button>
      </Col>
      </Row>
    </Form.Group>
</Form>  

  
    <hr/><br/>

    <h3>[Participant] Fill in this form to register an offer.</h3>
    <div className="form-group">
  <label className="is-required" htmlFor="role">Tender name</label>
  <select className="custom-select" name="view-selector" onChange={this.handleTenderName} placeholder={"Sender"} value={this.state.tenderName}>
  <option value=''> ---</option>
  {
    React.Children.toArray(
      this.state.tenderList.map((name, i) => <option key={i}>{name}</option>)
    )
  }
  </select>
</div>

    <Form>

      <Form.Group controlId="formBasicEmail">
        <Row>
          <Col>
            <h6>Ciphered AES key: </h6>
            <p>{this.state.c_key}</p> 
          </Col>
          <Col>
            <Form.Label className="is-required">Upload file</Form.Label>
            <div class="custom-file">
              <form>
                <input type="file" class="custom-file-input" id="exampleInputFile" onChange={this.onAESkeyChange} aria-describedby="helpTextFile" />
                <label class="custom-file-label" for="exampleInputFile">{this.state.AESkeyfileName}</label>
              </form>
            </div>
          </Col>
          <Col>
            <Button className="is-required" onClick={this.onIPFSSubmitAESkey}>Save AES key to IPFS</Button>
            <span class="form-text small text-muted" id="helpTextFile">Using infura ipfs storage.</span>
          </Col>
      </Row>

      </Form.Group>
      <hr/>
      <Form.Group controlId="formBasicEmail">
        <Row>
          <Col>
            <h6>Ciphered AES offer: </h6>
            <p>{this.state.c_offer}</p> 
          </Col>
          <Col>
            <Form.Label className="is-required">Upload file</Form.Label>
            <div class="custom-file">
              <form>
                <input type="file" class="custom-file-input" id="exampleInputFile" onChange={this.onAESofferChange} aria-describedby="helpTextFile" />
                <label class="custom-file-label" for="exampleInputFile">{this.state.AESofferfileName}</label>
              </form>
            </div>
          </Col>
          <Col>
            <Button className="is-required" onClick={this.onIPFSSubmitAESoffer}>Save AES offer to IPFS</Button>
            <span class="form-text small text-muted" id="helpTextFile">Using infura ipfs storage.</span>
          </Col>
      </Row>

      </Form.Group>
    </Form>  

    <FHERequestCmp 
      c_key={this.state.c_key} 
      c_offer={this.state.c_offer}
      tenderName = {this.state.tenderName}
      
    />


<hr/><br/>

<h3>[Tender Initiator] Close tender and launch comparison.</h3>
<div className="form-group">
<label className="is-required" htmlFor="role">Tender name</label>

<Row>
  <Col>
<select className="custom-select" name="view-selector" onChange={this.handleTenderChoice} placeholder={"Sender"} value={this.state.myTenderChoice}>
<option value=''> ---</option>
{
React.Children.toArray(
  this.state.tenderList.map((name, i) => <option key={i}>{name}</option>)
)
}
</select>
</Col>
<Col>
<Button onClick={this.launchComparison}>Compare and allocate</Button>
{this.state.balance < 10000000 ? 
    <Button variant="primary" type="submit" onClick={this.FundContract}>
    Fund Oracle
    </Button>:
    <Button variant="primary" type="submit" onClick={this.FundContract} disabled>
        Fund Oracle
    </Button>
    }
    {' '}

</Col>
</Row>
</div>

<Button onClick={this.getURLtest}>Debug</Button>
<p>{this.state.urlTest}</p>
  </div>
  </div>

  </div>;
  }};

export default FHERequest

