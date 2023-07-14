import * as url from "./url_helper";
import { APIClient } from "./api_helper";
import {
  DEL_ADS,
  DEL_TAG,
  GET_ADS_BY_ID,
  GET_EPG_GET_BY_ID,
  GET_LIST_ADS,
  GET_LIST_ARTICLE_BY_FILTER,
  GET_LIST_ARTICLE_TYPE_AVAILABILITY,
  GET_LIST_AUTHOR,
  GET_LIST_DISPLAY_TYPE,
  GET_LIST_LIVE_CHANNEL_SOURCE_TYPE,
  GET_TREE_LIST_CATEGORY,
  POST_ADS,
  POST_EVENT,
  POST_ROLE_TRANSITION_REMOVE_PUBLISH_STEP,
  POST_ROLE_TRANSITION_STEP,
  PUT_EVENT,
} from "./url_helper";

const api = new APIClient();

// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem("authUser");
  if (user) return JSON.parse(user);
  return null;
};

// //is user is logged in
export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Register Method
export const postFakeRegister = (data) =>
  api.create(url.POST_FAKE_REGISTER, data);

// Login Method
export const postFakeLogin = (data) => api.create(url.POST_FAKE_LOGIN, data);

// postForgetPwd
export const postFakeForgetPwd = (data) =>
  api.create(url.POST_FAKE_PASSWORD_FORGET, data);

// Edit profile
export const postJwtProfile = (data) =>
  api.create(url.POST_EDIT_JWT_PROFILE, data);

export const postFakeProfile = (data) =>
  api.update(url.POST_EDIT_PROFILE + "/" + data.idx, data);

// Register Method
export const postJwtRegister = (url, data) => {
  return api.create(url, data).catch((err) => {
    var message;
    if (err.response && err.response.status) {
      switch (err.response.status) {
        case 404:
          message = "Sorry! the page you are looking for could not be found";
          break;
        case 500:
          message =
            "Sorry! something went wrong, please contact our support team";
          break;
        case 401:
          message = "Invalid credentials";
          break;
        default:
          message = err[1];
          break;
      }
    }
    throw message;
  });
};

// Login Method
export const postJwtLogin = (data) => api.get(url.POST_FAKE_JWT_LOGIN, data);

// postForgetPwd
export const postJwtForgetPwd = (data) =>
  api.create(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

// postSocialLogin
export const postSocialLogin = (data) => api.create(url.SOCIAL_LOGIN, data);

// Calendar
// get Events
export const getEvents = () => api.get(url.GET_EVENTS);

// get Events
export const getCategories = () => api.get(url.GET_CATEGORIES);

// get Upcomming Events
export const getUpCommingEvent = () => api.get(url.GET_UPCOMMINGEVENT);

// add Events
export const addNewEvent = (event) => api.create(url.ADD_NEW_EVENT, event);

// update Event
export const updateEvent = (event) => api.put(url.UPDATE_EVENT, event);

// delete Event
export const deleteEvent = (event) =>
  api._delete(url.DELETE_EVENT, { headers: { event } });

// Chat
// get Contact
export const getDirectContact = () => api.get(url.GET_DIRECT_CONTACT);

// get Messages
export const getMessages = (roomId) =>
  api.get(`${url.GET_MESSAGES}/${roomId}`, { params: { roomId } });

// add Message
export const addMessage = (message) => api.create(url.ADD_MESSAGE, message);

// add Message
export const deleteMessage = (message) =>
  api._delete(url.DELETE_MESSAGE, { headers: { message } });

// get Channels
export const getChannels = () => api.get(url.GET_CHANNELS);

// MailBox
//get Mail
export const getMailDetails = () => api.get(url.GET_MAIL_DETAILS);

// delete Mail
export const deleteMail = (forId) =>
  api._delete(url.DELETE_MAIL, { headers: { forId } });

// Ecommerce
// get Products
export const getProducts = () => api.get(url.GET_PRODUCTS);

// delete Product
export const deleteProducts = (product) =>
  api._delete(url.DELETE_PRODUCT + "/" + product);

// add Products
export const addNewProduct = (product) =>
  api.create(url.ADD_NEW_PRODUCT, product);

// update Products
export const updateProduct = (product) =>
  api.update(url.UPDATE_PRODUCT + "/" + product._id, product);

// get Orders
export const getOrders = () => api.get(url.GET_ORDERS);

// add Order
export const addNewOrder = (order) => api.create(url.ADD_NEW_ORDER, order);

// update Order
export const updateOrder = (order) =>
  api.update(url.UPDATE_ORDER + "/" + order._id, order);

// delete Order
export const deleteOrder = (order) =>
  api._delete(url.DELETE_ORDER + "/" + order);

// get Customers
export const getCustomers = () => api.get(url.GET_CUSTOMERS);

// add Customers
export const addNewCustomer = (customer) =>
  api.create(url.ADD_NEW_CUSTOMER, customer);

// update Customers
export const updateCustomer = (customer) =>
  api.update(url.UPDATE_CUSTOMER + "/" + customer._id, customer);

// delete Customers
export const deleteCustomer = (customer) =>
  api._delete(url.DELETE_CUSTOMER + "/" + customer);

// get Sellers
export const getSellers = () => api.get(url.GET_SELLERS);

// Project
// get Project list
export const getProjectList = () => api.get(url.GET_PROJECT_LIST);

// Tasks
// get Task
export const getTaskList = () => api.get(url.GET_TASK_LIST);

// add Task
export const addNewTask = (task) => api.create(url.ADD_NEW_TASK, task);

// update Task
export const updateTask = (task) =>
  api.update(url.UPDATE_TASK + "/" + task._id, task);

// delete Task
export const deleteTask = (task) => api._delete(url.DELETE_TASK + "/" + task);

// CRM
// get Contacts
export const getContacts = () => api.get(url.GET_CONTACTS);

// add Contact
export const addNewContact = (contact) =>
  api.create(url.ADD_NEW_CONTACT, contact);

// update Contact
export const updateContact = (contact) =>
  api.update(url.UPDATE_CONTACT + "/" + contact._id, contact);

// delete Contact
export const deleteContact = (contact) =>
  api._delete(url.DELETE_CONTACT + "/" + contact);

// get Companies
export const getCompanies = () => api.get(url.GET_COMPANIES);

// add Companies
export const addNewCompanies = (company) =>
  api.create(url.ADD_NEW_COMPANIES, company);

// update Companies
export const updateCompanies = (company) =>
  api.update(url.UPDATE_COMPANIES + "/" + company._id, company);

// delete Companies
export const deleteCompanies = (company) =>
  api._delete(url.DELETE_COMPANIES + "/" + company);

// get Deals
export const getDeals = () => api.get(url.GET_DEALS);

// get Leads
export const getLeads = () => api.get(url.GET_LEADS);

// add Lead
export const addNewLead = (lead) => api.create(url.ADD_NEW_LEAD, lead);

// update Lead
export const updateLead = (lead) =>
  api.update(url.UPDATE_LEAD + "/" + lead._id, lead);

// delete Lead
export const deleteLead = (lead) => api._delete(url.DELETE_LEAD + "/" + lead);

// Crypto
// Transation
export const getTransationList = () => api.get(url.GET_TRANSACTION_LIST);

// Order List
export const getOrderList = () => api.get(url.GET_ORDRER_LIST);

// Invoice
//get Invoice
export const getInvoices = () => api.get(url.GET_INVOICES);

// add Invoice
export const addNewInvoice = (invoice) =>
  api.create(url.ADD_NEW_INVOICE, invoice);

// update Invoice
export const updateInvoice = (invoice) =>
  api.update(url.UPDATE_INVOICE + "/" + invoice._id, invoice);

// delete Invoice
export const deleteInvoice = (invoice) =>
  api._delete(url.DELETE_INVOICE + "/" + invoice);

// Support Tickets
// Tickets
export const getTicketsList = () => api.get(url.GET_TICKETS_LIST);

// add Tickets
export const addNewTicket = (ticket) => api.create(url.ADD_NEW_TICKET, ticket);

// update Tickets
export const updateTicket = (ticket) =>
  api.update(url.UPDATE_TICKET + "/" + ticket._id, ticket);

// delete Tickets
export const deleteTicket = (ticket) =>
  api._delete(url.DELETE_TICKET + "/" + ticket);

// Dashboard Analytics

// Sessions by Countries
export const getAllData = () => api.get(url.GET_ALL_DATA);
export const getHalfYearlyData = () => api.get(url.GET_HALFYEARLY_DATA);
export const getMonthlyData = () => api.get(url.GET_MONTHLY_DATA);

// Audiences Metrics
export const getAllAudiencesMetricsData = () =>
  api.get(url.GET_ALLAUDIENCESMETRICS_DATA);
export const getMonthlyAudiencesMetricsData = () =>
  api.get(url.GET_MONTHLYAUDIENCESMETRICS_DATA);
export const getHalfYearlyAudiencesMetricsData = () =>
  api.get(url.GET_HALFYEARLYAUDIENCESMETRICS_DATA);
export const getYearlyAudiencesMetricsData = () =>
  api.get(url.GET_YEARLYAUDIENCESMETRICS_DATA);

// Users by Device
export const getTodayDeviceData = () => api.get(url.GET_TODAYDEVICE_DATA);
export const getLastWeekDeviceData = () => api.get(url.GET_LASTWEEKDEVICE_DATA);
export const getLastMonthDeviceData = () =>
  api.get(url.GET_LASTMONTHDEVICE_DATA);
export const getCurrentYearDeviceData = () =>
  api.get(url.GET_CURRENTYEARDEVICE_DATA);

// Audiences Sessions by Country
export const getTodaySessionData = () => api.get(url.GET_TODAYSESSION_DATA);
export const getLastWeekSessionData = () =>
  api.get(url.GET_LASTWEEKSESSION_DATA);
export const getLastMonthSessionData = () =>
  api.get(url.GET_LASTMONTHSESSION_DATA);
export const getCurrentYearSessionData = () =>
  api.get(url.GET_CURRENTYEARSESSION_DATA);

// Dashboard CRM

// Balance Overview
export const getTodayBalanceData = () => api.get(url.GET_TODAYBALANCE_DATA);
export const getLastWeekBalanceData = () =>
  api.get(url.GET_LASTWEEKBALANCE_DATA);
export const getLastMonthBalanceData = () =>
  api.get(url.GET_LASTMONTHBALANCE_DATA);
export const getCurrentYearBalanceData = () =>
  api.get(url.GET_CURRENTYEARBALANCE_DATA);

// Dial Type
export const getTodayDealData = () => api.get(url.GET_TODAYDEAL_DATA);
export const getWeeklyDealData = () => api.get(url.GET_WEEKLYDEAL_DATA);
export const getMonthlyDealData = () => api.get(url.GET_MONTHLYDEAL_DATA);
export const getYearlyDealData = () => api.get(url.GET_YEARLYDEAL_DATA);

// Sales Forecast
export const getOctSalesData = () => api.get(url.GET_OCTSALES_DATA);
export const getNovSalesData = () => api.get(url.GET_NOVSALES_DATA);
export const getDecSalesData = () => api.get(url.GET_DECSALES_DATA);
export const getJanSalesData = () => api.get(url.GET_JANSALES_DATA);

// Dashboard Ecommerce
// Revenue
export const getAllRevenueData = () => api.get(url.GET_ALLREVENUE_DATA);
export const getMonthRevenueData = () => api.get(url.GET_MONTHREVENUE_DATA);
export const getHalfYearRevenueData = () =>
  api.get(url.GET_HALFYEARREVENUE_DATA);
export const getYearRevenueData = () => api.get(url.GET_YEARREVENUE_DATA);

// Dashboard Crypto
// Portfolio
export const getBtcPortfolioData = () => api.get(url.GET_BTCPORTFOLIO_DATA);
export const getUsdPortfolioData = () => api.get(url.GET_USDPORTFOLIO_DATA);
export const getEuroPortfolioData = () => api.get(url.GET_EUROPORTFOLIO_DATA);

// Market Graph
export const getAllMarketData = () => api.get(url.GET_ALLMARKETDATA_DATA);
export const getYearMarketData = () => api.get(url.GET_YEARMARKET_DATA);
export const getMonthMarketData = () => api.get(url.GET_MONTHMARKET_DATA);
export const getWeekMarketData = () => api.get(url.GET_WEEKMARKET_DATA);
export const getHourMarketData = () => api.get(url.GET_HOURMARKET_DATA);

// Dashboard Project
// Project Overview
export const getAllProjectData = () => api.get(url.GET_ALLPROJECT_DATA);
export const getMonthProjectData = () => api.get(url.GET_MONTHPROJECT_DATA);
export const gethalfYearProjectData = () =>
  api.get(url.GET_HALFYEARPROJECT_DATA);
export const getYearProjectData = () => api.get(url.GET_YEARPROJECT_DATA);

// Project Status
export const getAllProjectStatusData = () =>
  api.get(url.GET_ALLPROJECTSTATUS_DATA);
export const getWeekProjectStatusData = () =>
  api.get(url.GET_WEEKPROJECTSTATUS_DATA);
export const getMonthProjectStatusData = () =>
  api.get(url.GET_MONTHPROJECTSTATUS_DATA);
export const getQuarterProjectStatusData = () =>
  api.get(url.GET_QUARTERPROJECTSTATUS_DATA);

// Dashboard NFT
// Marketplace
export const getAllMarketplaceData = () => api.get(url.GET_ALLMARKETPLACE_DATA);
export const getMonthMarketplaceData = () =>
  api.get(url.GET_MONTHMARKETPLACE_DATA);
export const gethalfYearMarketplaceData = () =>
  api.get(url.GET_HALFYEARMARKETPLACE_DATA);
export const getYearMarketplaceData = () =>
  api.get(url.GET_YEARMARKETPLACE_DATA);

// Project
export const addProjectList = (project) =>
  api.create(url.ADD_NEW_PROJECT, project);
export const updateProjectList = (project) =>
  api.put(url.UPDATE_PROJECT, project);
export const deleteProjectList = (project) =>
  api._delete(url.DELETE_PROJECT, { headers: { project } });

// Pages > Team
export const getTeamData = (team) => api.get(url.GET_TEAMDATA, team);
export const deleteTeamData = (team) =>
  api._delete(url.DELETE_TEAMDATA, { headers: { team } });
export const addTeamData = (team) => api.create(url.ADD_NEW_TEAMDATA, team);
export const updateTeamData = (team) => api.put(url.UPDATE_TEAMDATA, team);

// File Manager

// Folder
export const getFolders = (folder) => api.get(url.GET_FOLDERS, folder);
export const deleteFolder = (folder) =>
  api._delete(url.DELETE_FOLDER, { headers: { folder } });
export const addNewFolder = (folder) => api.create(url.ADD_NEW_FOLDER, folder);
export const updateFolder = (folder) => api.put(url.UPDATE_FOLDER, folder);

// File
export const getFiles = (file) => api.get(url.GET_FILES, file);
export const deleteFile = (file) =>
  api._delete(url.DELETE_FILE, { headers: { file } });
export const addNewFile = (file) => api.create(url.ADD_NEW_FILE, file);
export const updateFile = (file) => api.put(url.UPDATE_FILE, file);

// To Do
export const getTodos = (todo) => api.get(url.GET_TODOS, todo);
export const deleteTodo = (todo) =>
  api._delete(url.DELETE_TODO, { headers: { todo } });
export const addNewTodo = (todo) => api.create(url.ADD_NEW_TODO, todo);
export const updateTodo = (todo) => api.put(url.UPDATE_TODO, todo);

// To do Project
export const getProjects = (project) => api.get(url.GET_PROJECTS, project);
export const addNewProject = (project) =>
  api.create(url.ADD_NEW_TODO_PROJECT, project);

//Job Application
export const getJobApplicationList = () => api.get(url.GET_APPLICATION_LIST);

//API Key
export const getAPIKey = () => api.get(url.GET_API_KEY);

//TSHT

//TAG
export const getAPIListTag = (offset, limit, _search) =>
  api.get(url.GET_LIST_TAG, { offset, limit, _search });
export const getAPITagById = (_tag_id) =>
  api.get(url.GET_TAG_BY_ID, { _tag_id });
export const getAPIPostTag = (tag) => api.create(url.POST_TAG, tag);
export const getAPIPutTag = (tag) => api.put(url.PUT_TAG, tag);
export const getAPIDeleteTag = (tag_id) => api.get(url.DEL_TAG, { tag_id });

//DEPARTMENT
export const getAPIListDepartment = (offset, limit) =>
  api.get(url.GET_LIST_DEPARTMENT, { offset, limit });
export const getAPIDepartmentById = (_department_id) =>
  api.get(url.GET_DEPARTMENT_BY_ID, { _department_id });
export const getAPIPostDepartment = (department) =>
  api.create(url.POST_DEPARTMENT, department);
export const getAPIPutDepartment = (department) =>
  api.put(url.PUT_DEPARTMENT, department);
export const getAPIDeleteDepartment = (department_id) =>
  api.get(url.DEL_DEPARTMENT, { department_id });

//CATEGORY
export const getAPIListCategory = (offset, limit) =>
  api.get(url.GET_LIST_CATEGORY, { offset, limit });
export const getAPITreeListCategory = (offset, limit) =>
  api.get(url.GET_TREE_LIST_CATEGORY, { offset, limit });
export const getAPICategoryById = (_category_id) =>
  api.get(url.GET_CATEGORY_BY_ID, { _category_id });
export const getAPIPostCategory = (category) =>
  api.create(url.POST_CATEGORY, category);
export const getAPIPutCategory = (category) =>
  api.put(url.PUT_CATEGORY, category);
export const getAPIDeleteCategory = (category_id) =>
  api.get(url.DEL_CATEGORY, { category_id });
//Account
export const getAPIListAccount = (offset, limit, _search) => {
  if (_search === undefined) {
    return api.get(url.GET_LIST_ACCOUNT, { offset, limit });
  } else {
    return api.get(url.GET_LIST_ACCOUNT, { offset, limit, _search });
  }
};
export const getAPIListAccountPermissiton = (offset, limit, _search) => {
  if (_search === undefined) {
    return api.get(url.GET_LIST_ACCOUNT_PERMISSION, { offset, limit });
  } else {
    return api.get(url.GET_LIST_ACCOUNT_PERMISSION, { offset, limit, _search });
  }
};

export const getAPIAccountById = (user_id) =>
  api.get(url.GET_ACCOUNT_BY_ID, { user_id });
export const getAPIAccountInfo = () => api.get(url.GET_LIST_ACCOUNT_INFO);

export const getAPIPostAccount = (account) =>
  api.create(url.POST_ACCOUNT, account);
export const getAPIPutAccount = (account) => api.put(url.PUT_ACCOUNT, account);
export const getAPIDeleteAccount = (user_id) =>
  api.get(url.DEL_ACCOUNT, { user_id });

//comment
export const getAPIListComment = (offset, limit, content_comment) =>
  api.get(url.GET_LIST_COMMENT, { offset, limit, content_comment });
export const getAPICommentById = (_comment_id) =>
  api.get(url.GET_COMMENT_BY_ID, { _comment_id });
export const getAPIPostComment = (comment) =>
  api.create(url.POST_COMMENT, comment);
export const getAPIApproveComment = (article_id, parent_id, comment_id) =>
  api.get(url.APPROVE_COMMENT, { article_id, parent_id, comment_id });

export const getAPIPutComment = (comment) => api.put(url.PUT_COMMENT, comment);

export const getAPIDeleteComment = (article_id, parent_id, comment_id) =>
  api.get(url.DEL_COMMENT, { article_id, parent_id, comment_id });

//Role - Quy trình
export const getAPIListRole = (offset, limit) =>
  api.get(url.GET_LIST_ROLE, { offset, limit });
export const getAPIRoleById = (role_id) =>
  api.get(url.GET_ROLE_BY_ID, { role_id });
export const getAPIRoleByArticleId = (article_id) =>
  api.get(url.GET_ROLE_BY_ARTICLE_ID, { article_id });
export const getAPIPostRole = (role) => api.create(url.POST_ROLE, role);
export const getAPIPostTransitionRole = (role) =>
  api.create(url.POST_ROLE_TRANSITION_STEP, role);
export const getAPIPostTransitionPublishRole = (article_id) =>
  api.get(url.POST_ROLE_TRANSITION_PUBLISH_STEP, { article_id });

export const getAPIGetReturnRole = (article_id) =>
  api.get(url.POST_ROLE_RETURN_STEP, { article_id });
export const getAPIPostTransitionUnPublishRole = (article_id) =>
  api.get(url.POST_ROLE_TRANSITION_REMOVE_PUBLISH_STEP, { article_id });
export const getAPIPutRole = (role) => api.put(url.PUT_ROLE, role);
export const getAPIDeleteRole = (role_id) => api.get(url.DEL_ROLE, { role_id });

//ARTICLE
export const getAPIListArticleType = () => api.get(url.GET_LIST_ARTICLE_TYPE);
export const getAPIListArticle = (
  offset,
  limit,
  _article_title,
  _category_id,
  _author,
  _todate,
  _fromdate,
  lst_status,
  _article_type_id
) =>
  api.get(url.GET_LIST_ARTICLE_BY_FILTER, {
    offset,
    limit,
    _article_title,
    _category_id,
    _author,
    _todate,
    _fromdate,
    lst_status,
    _article_type_id,
  });
export const getAPIListArticleTypeAvailability = () =>
  api.get(url.GET_LIST_ARTICLE_TYPE_AVAILABILITY);
export const getAPIListArticleRelated = (tag_list, limit) =>
  api.get(url.GET_LIST_ARTICLE_RELATED, { tag_list, limit });
export const getArticleFileMediaList = (data) =>
  api.get(url.ARTICLE_GET_FILE_LIST, data);

export const getAPIListAuthor = () => api.get(url.GET_LIST_AUTHOR);
export const getAPIPostArticle = (article) =>
  api.create(url.POST_ARTICLE, article);
export const getAPIPutArticle = (article) =>
  api.create(url.PUT_ARTICLE, article);
export const getAPIDeleteArticle = (article_id) =>
  api.get(url.DEL_ARTICLE, { article_id });
export const getAPIGetArticleById = (article_id) =>
  api.get(url.GET_ARTICLE_BY_ID, { article_id });
export const getAPIArticleHistory = (article_id) =>
  api.get(url.GET_ARTICLE_HISTORY, { article_id });
//process
export const downloadDocumentArticle = (data) =>
  api.get(url.EXPORT_DOC_ARTICLE, data, "blob");

//process -- cũng là quy trình
export const getAPIListProcess = (offset, limit) =>
  api.get(url.GET_LIST_PROCESS, { offset, limit });
export const getAPIProcessById = (_role_id) =>
  api.get(url.GET_PROCESS_BY_ID, { _role_id });
export const getAPIPostProcess = (process) =>
  api.create(url.POST_PROCESS, process);
export const getAPIPutProcess = (process) => api.put(url.PUT_PROCESS, process);
export const getAPIDeleteProcess = (_role_id) =>
  api.get(url.DEL_PROCESS, { _role_id });

//EPG - LiveChannel
export const getAPIListLiveChannel = (offset, limit) =>
  api.get(url.GET_LIST_CHANNEL, { offset, limit });
export const getAPIChannelById = (_live_channel_id) =>
  api.get(url.GET_CHANNEL_BY_ID, { _live_channel_id });
export const getAPIPostChannel = (channel) =>
  api.create(url.POST_CHANNEL, channel);
export const getAPIPutChannel = (live_channel_id) =>
  api.put(url.PUT_CHANNEL, live_channel_id);
export const getAPIDeleteChannel = (live_channel_id) =>
  api.get(url.DEL_CHANNEL, { live_channel_id });
export const getAPILiveChannelUpdateStatus = (live_channel_id, status) =>
  api.get(url.GET_UPDATE_STATUS, { live_channel_id, status });
export const getAPILiveChannelUpdateDRMStatus = (live_channel_id, status) =>
  api.get(url.GET_UPDATE_DRM_STATUS, { live_channel_id, status });

export const getAPIEpgListByDateAndChannel = (_channel_id) =>
  api.get(url.GET_EPG_LIST_BY_DATE_AND_CHANNEL, { _channel_id });
export const getAPIEpgById = (_epg_id) =>
  api.get(url.GET_EPG_GET_BY_ID, { _epg_id });
export const getAPIEpgGetListByChannelId = (
  offset,
  limit,
  _channel_id,
  _date
) =>
  api.get(url.GET_EPG_GET_LIST_BY_CHANNEL_ID, {
    offset,
    limit,
    _channel_id,
    _date,
  });
export const updateEPGList = (data) => api.put(url.INSERT_LIST_EPG, data);

export const importEPGList = (data) => api.put(url.IMPORT_LIST_EPG, data);

export const getAPIDeleteEpg = (epg_id) => api.get(url.DEL_EPG, { epg_id });

export const getAPIListLiveChannelSourceType = () =>
  api.get(url.GET_LIST_LIVE_CHANNEL_SOURCE_TYPE);

export const getListByOutstanding = (data) =>
  api.get(url.ARTICLE_GET_LIST_BY_OUTSTANDING, data);

export const getListByOutstandingSelected = (data) =>
  api.get(url.ARTICLE_GET_LIST_BY_OUTSTANDING_SELECTED, data);

export const updateListByOutstandingSelected = (data) =>
  api.put(url.ARTICLE_UPDATE_ORDER_POSITON, data);

// Nhóm quyền
export const getAPIListGroupFunction = () =>
  api.get(url.GET_LIST_GROUP_FUNCTION);
export const getAPIDetailGroupFunction = (_groups_id) =>
  api.get(url.GET_DETAIL_GROUP_FUNCTION, { _groups_id });
export const getAPIPostGroupFunction = (groupFunction) =>
  api.create(url.CREATE_GROUP_FUNCTION, groupFunction);
export const getAPIPutGroupFunction = (groupFunction) =>
  api.create(url.UPDATE_GROUP_FUNCTION, groupFunction);
export const getAPIDeleteGroupFunction = (_groups_id) =>
  api.get(url.DELETE_GROUP_FUNCTION, { _groups_id });

export const getAPIGroupFunction = (group_id) =>
  api.get(url.GET_GROUP_FUNCTION, { group_id });

export const updateAPIFunctionGroup = (type, data) =>
  type === "insert"
    ? api.put(url.INSERT_FUNCTION_GROUP, data)
    : api.get(url.DELETE_FUNCTION_GROUP, data);

// Các chức năng - quyền
export const getAPIListFunctionByUser = () =>
  api.get(url.GET_LIST_FUNCTION_BY_USER);
export const getAPIListFunction = () => api.get(url.GET_LIST_FUNCTION);
export const createFunction = (data) => api.create(url.CREATE_FUNCTION, data);
export const updateFunction = (data) => api.create(url.UPDATE_FUNCTION, data);
export const deleteFunction = (function_id) =>
  api.get(url.DELETE_FUNCTION, { function_id });

//Nhuận bút
export const getArticlePriceList = (data) =>
  api.get(url.STATIS_ARTICLE_PRICE_GET_LIST, data);
export const articlePriceExportExcel = (data) =>
  api.get(url.ARTICLE_PRICE_EXPORT_FILE_EXCEL, data, "blob");
export const getArticleAuthorList = () => api.get(url.ARTICLE_GET_LIST_AUTHOR);
export const getArticleTypeList = () => api.get(url.ARTICLE_GET_TYPE_LIST);
export const createArticlePrice = (data) =>
  api.create(url.CREATE_ARTICLE_PRICE, data);
export const getAPIArticlePriceById = (_article_id) =>
  api.get(url.GET_ARTICLE_PRICE_BY_ID, { _article_id });
export const getAPIPutArticlePrice = (article_price_id) =>
  api.put(url.PUT_ARTICLE_PRICE, article_price_id);

//events
export const getAPIListEvents = (
  offset,
  limit,
  event_name,
  _todate,
  _fromdate
) =>
  api.get(url.GET_LIST_EVENT, {
    offset,
    limit,
    event_name,
    _todate,
    _fromdate,
  });
export const getAPIDeleteEvent = (event_id) => api.get(url.DEL_EVENT, event_id);

export const getAPIPostEvent = (event_id) =>
  api.create(url.POST_EVENT, event_id);

export const getAPIPutEvent = (event_id) => api.put(url.PUT_EVENT, event_id);
export const getAPIEventById = (_event_id) =>
  api.get(url.GET_EVENT_BY_ID, { _event_id });

export const getAPIEventUpdateStatus = (event_id, status) =>
  api.get(url.GET_UPDATE_EVENT_STATUS, { event_id, status });
export const getAPIEventUpdateDRMStatus = (event_id, status) =>
  api.get(url.GET_UPDATE_EVENT_DRM_STATUS, { event_id, status });

//Media
export const getListMediaFile = (data) =>
  api.get(url.GET_LIST_MEDIA_FILE, data);

export const createListMediaFile = (data, option) =>
  api.createFile(url.CREATE_LIST_MEDIA_FILE, data, option);

export const deleteListMediaFile = (data) =>
  api.get(url.DELETE_LIST_MEDIA_FILE, data);

export const publicFileMedia = (data) => api.get(url.PUBLIC_FILE_MEDIA, data);

//ads
export const getAPIListAds = (
  offset,
  limit,
  ad_type,
  customer_info,
  status,
  date_to,
  date_from,
  ad_name
) =>
  api.get(url.GET_LIST_ADS, {
    offset,
    limit,
    ad_type,
    customer_info,
    status,
    date_to,
    date_from,
    ad_name,
  });
export const getAPIDeleteAds = (ad_id) => api.get(url.DEL_ADS, ad_id);
export const getAPIPostAds = (ad_id) => api.create(url.POST_ADS, ad_id);
export const getAPIListPageType = () => api.get(url.GET_LIST_PAGE_TYPE);
export const getAPIListDisplayType = (page_type_num) =>
  api.get(url.GET_LIST_DISPLAY_TYPE, { page_type_num });
export const getAPIAdsById = (_ad_id) => api.get(url.GET_ADS_BY_ID, { _ad_id });
export const getAPIPutAds = (ad_id) => api.put(url.PUT_ADS, ad_id);

//giao dien
export const getAPIHeaderById = (header_id) =>
  api.get(url.GET_HEADER_BY_ID, { header_id });
export const getAPIPostHeader = (data) => api.put(url.PUT_HEADER, data);
export const getAPIFooterById = (footer_id) =>
  api.get(url.GET_FOOTER_BY_ID, { footer_id });
export const getAPIPostFooter = (data) => api.put(url.PUT_FOOTER, data);
export const getListMenu = (data) => api.get(url.MENU_GET_LIST, data);
export const updateMenu = (data) => api.put(url.MENU_UPDATE, data);

//dashboard
export const getAPIListStatusLineChart = (top, article_status_id, time_type) =>
  api.get(url.GET_LIST_STATUS_LINE_CHART, {
    top,
    article_status_id,
    time_type,
  });
