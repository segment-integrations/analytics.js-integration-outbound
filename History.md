
1.0.4 / 2015-07-30
==================

  * update trait handling to omit all cases of special traits from attributes
    
    Previously, the way this integration was written, "top-level" user attributes (email, first name, last name, phone) would be erroneously included twice if sent in anything but camel-case — once in their respective top level parameters and once in the catch-all `attributes` sub-object.
    
    That's redundant, and not how our server-side integration works. This fix eliminates that behavior so that the top-level attributes are excluded from the catch-all `attributes` sub-object.

1.0.3 / 2015-06-30
==================

  * Replace analytics.js dependency with analytics.js-core

1.0.2 / 2015-06-24
==================

  * Bump analytics.js-integration version

1.0.1 / 2015-06-24
==================

  * Bump analytics.js-integration version

1.0.0 / 2015-06-09
==================

  * Initial commit :sparkles:
