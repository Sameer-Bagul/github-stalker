const fs = require('fs').promises;

/**
 * Output handler module for writing portfolio data to JSON file or console.
 */
class OutputHandler {
  /**
   * Outputs portfolio data to the console.
   * @param {Array|Object} data - The portfolio data to output.
   */
  static outputToConsole(data) {
    console.log(JSON.stringify(data, null, 2));
  }

  /**
   * Outputs portfolio data to a JSON file.
   * @param {Array|Object} data - The portfolio data to output.
   * @param {string} filename - The filename to write to.
   * @returns {Promise<void>}
   */
  static async outputToFile(data, filename) {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(filename, jsonData, 'utf8');
    } catch (error) {
      throw new Error(`Failed to write to file ${filename}: ${error.message}`);
    }
  }

  /**
   * Outputs portfolio data to 'portfolio.json'.
   * @param {Array|Object} data - The portfolio data to output.
   * @returns {Promise<void>}
   */
  static async output(data) {
    await this.outputToFile(data, 'portfolio.json');
  }
}

module.exports = OutputHandler;