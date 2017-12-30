/**
 * Set up a DOM test based on an HTML fixture and a function for acting on the
 * DOM. The supplied HTML fixture will be written to the DOM and the action
 * invoked once the DOM is fully loaded.
 *
 * @example
 * test(
 *   `
 *   <p>This is a paragraph of text</p>
 *   `,
 *   p => assert(p.textContent === 'This is a paragraph of text')
 * );
 *
 * @param {String} html
 * @param {Function} action
 * @return {Promise}
 */
export default function test(html = '', action = () => undefined) {
  // Open the current document, overwrite its contents with the HTML specified
  // for the current test case, and close the document again. This operation
  // may or may not finish synchronously as additional resources might have to
  // be loaded.
  document.open();
  document.write(html);
  document.close();

  return new Promise((resolve, reject) => {
    // If the document was parsed and loaded synchronously then run test case
    // immediately.
    if (document.readyState === 'complete') {
      act(resolve, reject);
    // Otherwise, we will need to wait for the document to finish loaded. Once
    // loaded we can then run the test case.
    } else {
      document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
          act(resolve, reject);
        }
      };
    }
  });

  /**
   * @param {Function} resolve
   * @param {Function} reject
   */
  function act(resolve, reject) {
    const {head, body} = document;

    let context;

    // If the <head> element contains children, this would indicate that the
    // caller supplied HTML containing a more complex document and not just
    // elements contained in the body. The test context is therefore set to the
    // <html> element itself. E.g.:
    //
    //   <html>
    //     <head>
    //       <title>This is a title</title>
    //     </head>
    //     <body>
    //       <p>This is paragraph of text</p>
    //     </body>
    //   </html>
    //
    if (head.children.length !== 0) {
      context = document.documentElement;
    // If instead only a single element is contained within the body, we simply
    // use this element as the context as the caller likely only specified this
    // single element in the HTML. E.g.:
    //
    //   <p>This is a paragraph of text</p>
    //
    } else if (body.children.length === 1) {
      context = body.children[0];
    // Otherwise, use the body as the test context if multiple elements exists
    // within the body. E.g.:
    //
    //   <p>This is a paragraph of text</p>
    //   <img src="foo.png" alt="This is an adjacent image">
    //
    } else {
      context = body;
    }

    let result;
    try {
      result = action(context);
    } catch (err) {
      return reject(err);
    }

    if (result && result.constructor === Promise) {
      result.then(() => resolve(context)).catch(reject);
    } else {
      resolve(context);
    }
  }
}
