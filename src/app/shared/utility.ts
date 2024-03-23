import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as constant from './constant';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  constructor() {}

  areStringsEqualIgnoreCase(str1: string, str2: string): boolean {
    return str1.toLowerCase() === str2.toLowerCase();
  }

arePasswordsMatching(password: any, confirmPassword: any) {
    return password === confirmPassword;
  }

  setItemToLocalStorage(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
    }
  }

  getItemToLocalStorage(key: string): any | null {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : null;
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  }

  removeItemToLocalStorage(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
    }
  }

  clearToLocalStorage(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  encrypt(data: any): string {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), constant.secretKey).toString();
    return encryptedData;
  }

  decrypt(encryptedData: string): any {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, constant.secretKey);
    const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }


   validateMobileNumber(mobileNumber: string): boolean {
    // Implement your mobile number validation logic here
    // For example, check if it has a valid length, consists only of digits, etc.
    const regex = /^[0-9]{10}$/; // Assumes a 10-digit mobile number
    return regex.test(mobileNumber);
  }

  validateEmail(email: string) {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    return emailRegex.test(email);
  }


}