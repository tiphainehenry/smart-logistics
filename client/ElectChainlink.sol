pragma solidity ^0.5.16;

import "github.com/smartcontractkit/chainlink/evm-contracts/src/v0.6/ChainlinkClient.sol";
pragma experimental ABIEncoderV2;
contract MainElect is ChainlinkClient {

bytes32 public volume;

address private oracle;
bytes32 private jobId;
uint256 private fee;

string public bestProfiles;
address public owner;


uint[] filter;

string filteredIds;

enum AvailabiltyState{ONEDAY, SEVERALDAYS}
AvailabiltyState avState;

uint[] candidate;


uint[][] candidates = [
[0, 12,1,21, 13,1,21, 1,1,1,10,3],
[1, 12,1,21, 13,1,21, 1,0,1,0,10],
[2, 1,1,21, 13,1,21, 1,1,1,5,10],
[3, 12,1,21, 13,1,21, 0,1,0,10,5],
[4, 12,1,21, 13,1,21, 1,0,1,10,3],
[5, 12,1,21, 13,1,21, 0,0,0,10,3],
[6, 12,1,21, 13,1,21, 0,0,0,10,3],
[7, 12,1,21, 13,1,21, 1,1,0,10,3],
[8, 12,1,21, 13,1,21, 0,1,1,10,3]
];


//uint[][] candidates;

bool hasCandidates = false;


uint[] normalized;
uint[][] normalizedArray;
uint[][] tmpNormalizedArray;
uint[] QoSList;
uint[] sortedQoSList;

uint QoS;
uint n;

//uint K=3; num params

string alphas;


event BestCandidates(
string ExistCandidates,
string profiles
);

enum TestOutput{NO,YES}
TestOutput output;

struct Date {
uint day;
uint month;
uint year;
}

string public qosList_string;
event LogConstructorInitiated(string nextStep);
event LogQoSCompute(string qosList);
event LogNewProvableQuery(string description);


///// Delegated services
function getfilter() public view returns(uint[] memory){
return filter;
}

function existsCandidates() public view returns(bool){
return hasCandidates;
}

function setCandidates(uint[][] memory _candidates) public payable {
candidates = _candidates;
}

function getCandidates() public view returns(uint[][] memory){
return candidates;
}

function getAvailabiltyState() public view returns(AvailabiltyState){
return avState;
}

function getQoSList() public view returns(uint[] memory){
return QoSList;
}

function getSortedQoS() public view returns(uint[] memory){
return sortedQoSList;
}

function getNormalized() public view returns(uint[] memory){
return normalized;
}

function getNormalizedArray() public view returns(uint[][] memory){
return normalizedArray;
}

function getQoS() public view returns (uint){
return QoS;
}

function getN() public view returns (uint){
// number of services realized
return n;
}

function getBestProfiles() public view returns (string memory){
return bestProfiles;
}



function oneDayAvailability(uint[] memory person, uint[] memory availability) public payable returns(uint){


Date memory ASDate = Date(_person[1],_person[2],_person[3]); // available start
Date memory AEDate = Date(_person[4],_person[5],_person[6]); //available end

Date memory RSDate = Date(_availability[0],_availability[1],_availability[2]); // required start

output = TestOutput.YES;


if((RSDate.month==ASDate.month) && (RSDate.year==ASDate.year)){ // same month, same year
if((ASDate.day > RSDate.day)||(AEDate.day<RSDate.day)){ // person is booked
output = TestOutput.NO;
}
}
else if((RSDate.month!=ASDate.month) && (RSDate.year==ASDate.year)){ //same year, different month
if(!((ASDate.month < RSDate.month) && (ASDate.day < RSDate.day)) || (AEDate.month<RSDate.month)){ // person is booked
output = TestOutput.NO;
}
}
else{ //different year
if(!(RSDate.year>ASDate.year)||(AEDate.year<RSDate.year)){ // person is booked
output = TestOutput.NO;
}
}
return uint(output);
}


function severalDaysAvailability(uint[] memory person, uint[] memory availability) public payable returns(uint){

Date memory ASDate = Date(_person[1],_person[2],_person[3]); // available start
Date memory AEDate = Date(_person[4],_person[5],_person[6]); //available end

Date memory RSDate = Date(_availability[0],_availability[1],_availability[2]); // required start
Date memory REDate = Date(_availability[3],_availability[4],_availability[5]); // required end

output = TestOutput.YES;

require(REDate.day>RSDate.day);

if((RSDate.month==ASDate.month) && (RSDate.year==ASDate.year) && (REDate.year==AEDate.year)){ // same start month, same year
if((ASDate.day > RSDate.day)||(AEDate.day<REDate.day)){ // person is booked
output = TestOutput.NO;
}
}
else if((RSDate.month!=ASDate.month) && (RSDate.year==ASDate.year) && (REDate.year==AEDate.year)){ //same year, different month
if(!((ASDate.month < RSDate.month) && (ASDate.day < RSDate.day)) || (AEDate.month<RSDate.month) || (AEDate.month<REDate.month)){ // person is booked
output = TestOutput.NO; }
}
else{ //different year
if(!(RSDate.year>ASDate.year)||(AEDate.year<RSDate.year)||(AEDate.year<REDate.year)){ // person is booked
output = TestOutput.NO; }
}

return uint(output);
}

//event ToString(string result);

function uint2str(uint i) internal pure returns (string memory uintAsString) {
if (i == 0) {
return "0";
}
uint j = i;
uint len;
while (j != 0) {
len++;
j /= 10;
}
bytes memory bstr = new bytes(len);
uint k = len - 1;
while (i != 0) {
bstr[k--] = byte(uint8(48 + i % 10));
i /= 10;
}
return string(bstr);
}



//event ToString(string result);


function list2string(uint[] memory list) public payable returns(string memory) {

string memory str_list = "[";
for(uint j=0;j<list.length-1;j++){
str_list = string(abi.encodePacked(str_list, uint2str(list[j]), ","));
}
str_list = string(abi.encodePacked(str_list,uint2str(list[list.length-1]), "]"));
//emit ToString(str_list);
return str_list;
}


function uintarrays2string(uint[][] memory array, uint num_param) public payable returns(string memory) {
string memory str_matrix = "[";

uint ind_param = array.length - num_param;

for(uint i=0;i<array.length-1;i++){ // for each candidate, compute str

uint[] memory cdd = array[i];
string memory str_cdd = "[";

for(uint j=ind_param;j<array[0].length-1;j++){
str_cdd = string(abi.encodePacked(str_cdd, uint2str(cdd[j]), ","));
}
str_matrix = string(abi.encodePacked(str_matrix, str_cdd, uint2str(cdd[array[0].length-1]), "],"));

}

uint[] memory cdd = array[array.length-1];
string memory str_cdd = "[";
for(uint j=ind_param;j<array[0].length-1;j++){
str_cdd = string(abi.encodePacked(str_cdd, uint2str(cdd[j]), ","));
}
str_matrix = string(abi.encodePacked(str_matrix, str_cdd, uint2str(cdd[array[0].length-1]), "]]"));

//emit ToString(str_matrix);

return str_matrix;

}

constructor() public {
setPublicChainlinkToken();
oracle = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b;
jobId = "b7285d4859da4b289c7861db971baf0a";
fee = 0.1 10 * 18; // 0.1 LINK
}

function requestVolumeData(uint[] memory filteringAttributes, uint[] memory availability, string memory _alphas, uint num_alphas) public returns (bytes32 requestId)
{
Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
hasCandidates=false; // reset

alphas =_alphas;

// proceed to filtering
uint[] memory _filter = new uint[](candidates.length);
// reinitialize list of candidates
for(uint i=0; i<candidates.length;i++){
_filter[i]=0;
}

for(uint ind=0; ind<candidates.length; ind++){ // test all candidates
delete candidate;

candidate = candidates[ind];

bool testOutput = true;

// filter on attributes
uint index=0;

uint filterMaxInd = 7 + filteringAttributes.length;

for(uint id_att=7; id_att<filterMaxInd; id_att++){
if((filteringAttributes[index]==1) && (candidate[id_att]!=1)){
testOutput=false;
}
index++;
}

//filter on availability

if(testOutput){
if((availability.length==3)||
((availability[0]==availability[3])&&(availability[1]==availability[4])&&(availability[2]==availability[5]))){ // ask for a day booking
avState = AvailabiltyState.ONEDAY;
_filter[ind]=oneDayAvailability(candidate, availability);
}
else{
//availability.length==6, ask for a several-days booking
avState = AvailabiltyState.SEVERALDAYS;
_filter[ind]=severalDaysAvailability(candidate, availability);
}

if(_filter[ind] == 1){
hasCandidates=true;
}
}
}

filter = _filter;
if(hasCandidates){
/// compute qos via oracle
// Set the URL to perform the GET request on
string memory str_matrix = uintarrays2string(candidates,num_alphas);
string memory str_filter = list2string(filter);
// request.add("get", string(abi.encodePacked("https://qosapi.herokuapp.com/api/qos?matrix=", str_matrix, "&alpha=[", alphas,"]", "&filter=", str_filter)));
request.add("get", "https://qosapi.herokuapp.com/api/qosjson?matrix=[[1,2,3],[2,4,2],[16,4,4],[6,4,4]]&alpha=[6,4,7]&filter=[1,1,0,0]");
request.add("path", "bestProfiles");



// Sends the request
return sendChainlinkRequestTo(oracle, request, fee);
}
else {
emit BestCandidates('No matching found', '');
}
}

/**
* Receive the response in the form of uint256
*/
string public test;
function fulfill(bytes32 requestId, bytes32 volume) public recordChainlinkFulfillment(_requestId)
{
test="works";
volume = _volume;
bestProfiles = bytes32ToString(volume);
emit BestCandidates(
'Matching',
bestProfiles
);
}

function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
uint8 i = 0;
while(i < 32 && _bytes32[i] != 0) {
i++;
}
bytes memory bytesArray = new bytes(i);
for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
bytesArray[i] = _bytes32[i];
}
return string(bytesArray);
}
}