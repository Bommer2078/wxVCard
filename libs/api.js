import http from './serve'
const login = (params) => http.get('/mini/login', params);//用户登录
const saveUserInfo = (params) => http.get('/mini/save', params);//用户登录
const getPlaceList = (params) => http.post('/city/list',params);//归属地列表
const getVenueList = (params) => http.get('/venue/list',params);//场馆列表
const getCardDetail = (id) => http.get(`/card/details`,id);//权益卡详情
const getOrderList = (params) => http.post(`/order/list`,params); //订单列表
const getVenueDetail = (params) => http.get(`/venue/details`,params); 
const exchangeCard = (params) => http.post(`/order/exchange`,params); 
const wxPay = (params) => http.post(`/payment/prepay`,params); 
const purchase = (params) => http.post(`/order/purchase`,params); // 下单接口
const myCardList = () => http.post(`/user/card/list`); // 拥有的权益卡列表
const checkBusiness = () => http.get(`/venue/user/list`); // 是否是商家
const getAboutInfo = () => http.get(`/config/details`); // 關於
const loopPayOrder = (params) => http.post(`/order/loop_pay_order`,params); // 用户轮询
const venueOrder = (params) => http.post(`/order/pay_venue`,params); // 管理员下单
const adminLoopOrder = (params) => http.post(`/order/admin_loop_order`,params); // 管理员轮询
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
    myCardList: myCardList,
    wxPay: wxPay,
    checkBusiness: checkBusiness,
    getAboutInfo: getAboutInfo,
    loopPayOrder: loopPayOrder,
    venueOrder: venueOrder,
    adminLoopOrder: adminLoopOrder
};
export default api;
