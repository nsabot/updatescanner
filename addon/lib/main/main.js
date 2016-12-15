/* global Sidebar, PageStore, Page */
/* exported Main */

/**
 * Class representing the main Update Scanner content page.
 */
class Main {
  /**
   * @property {Sidebar} sidebar - Object representing the sidebar element.
   * @property {PageStore} pageStore - Object used for saving and loading data
   * from storage.
   */
  constructor() {
    this.sidebar = new Sidebar('#tree');
    this.pageStore = undefined;
  }

  /**
   * Initialises the main page's sidebar and content iframe.
   */
  init() {
    PageStore.load().then((pageStore) => {
      this.pageStore = pageStore;
      this.sidebar.load(pageStore.pageMap, PageStore.ROOT_ID);
      this.sidebar.registerSelectHandler((evt, data) =>
                                         this._onSelect(evt, data));
    });
  }

  /**
   * Called whenever a single item in the sidebar is selected. If the selected
   * item is a Page, load the page's HTML into the iframe.
   *
   * @param {Page|PageFolder} item - Selected Page or PageFolder object.
   */
  _onSelect(item) {
    if (item instanceof Page) {
      this._loadHtml(item.id)
        .then((html) => this._loadIframe(html))
        .catch(console.log.bind(console));
      }
  }

  /**
   * Loads the specified Page HTML from the PageStore.
   *
   * @param {string} id - ID of the Page to load.
   * @returns {Promise} A Promise to be fulfilled with the requested HTML.
   */
  _loadHtml(id) {
    return PageStore.loadHtml(id, PageStore.htmlTypes.NEW)
      .then(function(html) {
        if (html === undefined) {
          throw Error('Could not load "' + id + '" changes HTML from storage');
        }
        return html;
      });
  }

  /**
   * Creates a content iframe and inserts it into the main content area.
   *
   * @param {string} html - HTML to load.
   */
  _loadIframe(html) {
    this._removeIframe();
    const iframe = document.createElement('iframe');
    iframe.id = 'frame';
    iframe.sandbox = '';
    iframe.srcdoc = html;
    document.querySelector('#main').appendChild(iframe);
  }

  /**
   * Remove the iframe from the DOM, if it exists.
   */
  _removeIframe() {
    const iframe = document.querySelector('#frame');
    if (iframe) {
      iframe.parentNode.removeChild(iframe);
    }
  }

}
