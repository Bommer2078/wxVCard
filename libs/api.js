import http from './serve'
const login = (params) => http.get('/mini/login', params);//用户登录
const saveUserInfo = (params) => http.get('/mini/save', params);//用户登录
const getPlaceList = (params) => http.post('/city/list',params);//归属地列表
const getVenueList = (params) => http.get('/venue/list',params);//场馆列表
const getCardDetail = (id) => http.get(`/card/details`,id);//权益卡详情
const getOrderList = (params) => http.post(`/order/list`,params); //订单列表
const getVenueDetail = (params) => http.get(`/venue/details`,params); 
const exchangeCard = (params) => http.post(`/user/card/exchange`,params); 
const purchase = (params) => http.post(`/order/purchase`,params); // 下单接口
const myCardList = () => http.post(`/user/card/list`); // 拥有的权益卡列表
let api = {
    login: login,
    saveUserInfo: saveUserInfo,
    getPlaceList: getPlaceList,
    getVenueList: getVenueList,
    getCardDetail: getCardDetail,
    getOrderList: getOrderList,
    getVenueDetail: getVenueDetail,
    exchangeCard: exchangeCard,
    purchase: purchase,
    myCardList: myCardList
};
export default api;
