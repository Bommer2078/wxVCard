import http from './serve'
const getSms = (params) => http.get('/common/sendSms', params);//获取短信验证码
const registerUser = (params) => http.post('/user/register', params);//用户注册
const updatePassword = (params) => http.put(`/user/updatePassword`,params); //用户修改密码
const resetPassword = (params) => http.put(`/user/resetPassword`,params); //用户修改密码
const login = (params) => http.get('/mini/login', params);//用户登录
const saveUserInfo = (params) => http.get('/mini/save', params);//用户登录
const getPlaceList = (params) => http.post('/city/list',params);//归属地列表
const getTickeList = (params) => http.get('/yearTicket/list',params);//联票列表
const getVenueList = (params) => http.get('/venue/list',params);//场馆列表
const getCardDetail = (id) => http.get(`/card/details`,id);//权益卡详情
const getVenueTypeList = () => http.get(`/dictionaryItem/listByDictionaryId?dictionaryId=10`);//取场馆分类列表
const creatOrder = (params) => http.post(`/order`,params);//新增订单
const bindTicket = (params) => http.put(`/ticket/bandingNameAndPhoto`,params);//票绑定
const getOrderList = (params) => http.get(`/order/listByUsername`,params); 
const payConfirm = (id) => http.put(`/order/paymentOrder/${id}`);
const bindTicketList = (params) => http.get(`/ticket/listTicketByUsername`,params); //用戶已綁定的联票
const getOrderDetail = (params) => http.get(`/order/orderDetail`,params); 
const writeOffYearTicket = (params) => http.post(`/ticket/writeOffYearTicket`,params); 
const writeOffSpecialTicket = (params) => http.post(`/ticket/writeOffSpecialTicket`,params); 
const getAllCount = (params) => http.get(`/verify/listCountByVerifyUsername`,params); 
const getStatisList = (params) => http.get(`/verify/listByVerifyUsername`,params); 
const getVenueDetail = (params) => http.get(`/venue/details`,params); 
const wxPay = (params) => http.get(`/wx/appletPay`,params); 
const getAboutList = (params) => http.get(`/notice/list`,params); 
const getAbout = (id) => http.get(`/notice/${id}`); 
const appointmentVenue = (params) => http.post(`/booking/bookingVenue`,params); 
const getBookingList = (params) => http.get(`/booking/listBookingByUsername`,params); 
let api = {
    getSms: getSms,
    registerUser: registerUser,
    resetPassword: resetPassword,
    updatePassword: updatePassword,
    login: login,
    saveUserInfo: saveUserInfo,
    getPlaceList: getPlaceList,
    getTickeList: getTickeList,
    getVenueList: getVenueList,
    getCardDetail: getCardDetail,
    getVenueTypeList: getVenueTypeList,
    creatOrder: creatOrder,
    bindTicket: bindTicket,
    getOrderList: getOrderList,
    payConfirm: payConfirm,
    bindTicketList: bindTicketList,
    getOrderDetail: getOrderDetail,
    writeOffYearTicket: writeOffYearTicket,
    writeOffSpecialTicket: writeOffSpecialTicket,
    getAllCount: getAllCount,
    getStatisList: getStatisList,
    getVenueDetail: getVenueDetail,
    wxPay: wxPay,
    resetPassword: resetPassword,
    getAboutList: getAboutList,
    getAbout: getAbout,
    appointmentVenue: appointmentVenue,
    getBookingList: getBookingList,
};
export default api;
