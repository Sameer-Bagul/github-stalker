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
      console.log(`Portfolio data written to ${filename}`);
    } catch (error) {
      throw new Error(`Failed to write to file ${filename}: ${error.message}`);
    }
  }

  /**
   * Outputs portfolio data based on the provided options.
   * @param {Array|Object} data - The portfolio data to output.
   * @param {Object} options - Options object with output and file properties.
   * @param {string} options.output - 'console' or 'file'.
   * @param {string} [options.file] - Filename if output is 'file'.
   * @returns {Promise<void>}
   */
  static async output(data, options) {
    if (options.output === 'file') {
      if (!options.file) {
        throw new Error('Filename is required when output is set to file');
      }
      await this.outputToFile(data, options.file);
    } else {
      this.outputToConsole(data);
    }
  }
}

module.exports = OutputHandler;