//UAT URL:>

// export const baseUrl = 'http://ezpark.incubermax.com/';
// export const apiVersion = "1.0"

//Development URL:>
export const baseUrl = "http://184.168.126.119/";
export const apiVersion = "1.0";

// LIVE URL:>
// export const baseUrl = "http://eazyparkapp.incubermax.com/";
// export const apiVersion = "1.0";

//Production;
export const url = {
  baseUrl: "http://eazyparkapp.incubermax.com/",
};
// export const url = {
//   baseUrl: 'http://184.168.126.119/',
// };

export const apiName = {
  createOtp: "OTP/OTPGeneration/CreateOTP",
  validateOtp: "OTP/OTPGeneration/Validate",
  login: "Auth/Login",
  vehicleType: "Vehicle/Vehicle/GetAllVehicleType",
  vehicleModal: "Vehicle/Vehicle/GetAllVehicleModel?vehicletype=",
  addVehicle: "Vehicle/Vehicle/AddVehicle",
  deleteVehicle: "Vehicle/Vehicle/DeleteVehicle",
  findLocation: "Geolocation/Location/FindNearestLocation",
  getVehicle: "Vehicle/Vehicle/GetRegisterVehicleList?userid=",
  registerRequest: "Vehicle/vehicle/RegisterRequest",
  deleteVehicleDocRequest: "Vehicle/vehicle/DeleteVehicleDoc",
  uploadVehicleDoc: "Vehicle/vehicle/UploadVehicleDoc?requestid=",
  getFacilityDetails: "ParkingAPI/Parking/GetFacilityDetails",
  bookParking: "ParkingAPI/Parking/BookParking",
  bookingHistory: "ParkingAPI/Parking/BookingHistory",
  setFavourite: "Geolocation/Location/SetFavourite",
  getFavourite: "Geolocation/Location/GetFavourite",
  getQRCode: "ParkingAPI/Parking/GetQRCode",
  getUpcomingBooking: "ParkingAPI/Parking/GetUpcomingBooking",
  parkingInitiate: "ParkingAPI/Parking/PaymentInitiate",
  cancelBooking: "ParkingAPI/Parking/CancelBooking",
  getAvailableDates: "ParkingAPI/Parking/GetAvailableDates",
  changeBooking: "ParkingAPI/Parking/ChangeBooking",
  pUpdate: "ParkingAPI/Parking/PUpdate",
  getCurrentBooking: "ParkingAPI/Parking/GetCurrentBooking",
  getBookingDetails: "ParkingAPI/Parking/GetBookingDetails",
  guestParking: "ParkingAPI/Parking/GuestParking",
  GetPassList: "ParkingAPI/Parking/GetPassList",
  GetPassRequetsList: "ParkingAPI/Parking/GetPassRequetsList",

  SendPassRequets: "ParkingAPI/Parking/SendPassRequets",

  GetCheckInCheckOutReport: "ReportAPI/Report/GetCheckInCheckOutReport",

  GetFacilityListForPass: `Geolocation/Location/GetFacilityListForPass`,
  getUserProfile: `myprofile/myprofile/GetUserProfile`,
  setUserProfile: `myprofile/myprofile/SetUserProfile`,
};
