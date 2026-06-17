class BaseAdapter {
  /**
   * Returns UI form configuration details.
   * @returns {Object} { title: string, logo: string, fields: Array }
   */
  getFormConfig() {
    throw new Error("getFormConfig() must be implemented");
  }

  /**
   * Handles authentication, validation, deduplication, and lead submission to the partner API.
   * @param {Object} leadData 
   * @returns {Promise<Object>} Unified response format: { success: boolean, redirectUrl: string, offer: string, apiResponse: any }
   */
  async register(leadData) {
    throw new Error("register(leadData) must be implemented");
  }
}

module.exports = BaseAdapter;
