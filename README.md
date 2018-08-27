<h1>
  <img
    src="https://github.com/mserajnik/hydrusrvue/raw/master/media/logo.png"
    alt="hydrusrvue logo"
    width="128">
  <br>
  hydrusrvue
  <a href="https://travis-ci.com/mserajnik/hydrusrvue">
    <img src="https://travis-ci.com/mserajnik/hydrusrvue.svg" alt="Build status">
  </a>
  <a href="https://snyk.io/test/github/mserajnik/hydrusrvue">
    <img
      src="https://snyk.io/test/github/mserajnik/hydrusrvue/badge.svg"
      alt="Known vulnerabilities">
  </a>
  <a href="https://standardjs.com">
    <img
      src="https://img.shields.io/badge/code_style-standard-brightgreen.svg"
      alt="JavaScript Standard Style">
  </a>
</h1>

> A Vue-based frontend for [hydrusrv][hydrusrv]

hydrusrvue is a [Vue][vue]-based frontend for [hydrusrv][hydrusrv] that makes
use of its entire feature set, allowing you to access your media managed with
[hydrus server][hydrus-server] on the web. It is largely built with
[Bulma][bulma] and optimized for all common desktop and mobile screen sizes.

The most prominent features are:

+ Comprehensive options to search and sort your files and tags
+ A gallery mode in the files search page that allows you to comfortably view
  your files in a lightbox without navigating to the detail page
+ Direct support for common image and video formats on the web; non-supported
  files can be downloaded and viewed locally
+ Built-in user registration and actions like changing username or password or
  deleting the user altogether
+ The ability to define options like tag colors and default sorting methods on
  a per-client basis, allowing you to have different settings in each browser
+ Fast delivery due to [lazy loading routes][lazy-loading-routes]
+ Enhanced performance on modern browsers thanks to [Vue CLI][vue-cli]'s
  [modern mode][modern-mode]

## Table of contents

+ [Install](#install)
  + [Dependencies](#dependencies)
  + [Updating](#updating)
+ [Usage](#usage)
  + [Configuration](#configuration)
  + [Develop](#develop)
  + [Build](#build)
  + [Deploy](#deploy)
+ [Demo](#demo) 
+ [Screenshots](#screenshots)
+ [Donate](#donate)
+ [Maintainer](#maintainer)
+ [Contribute](#contribute)
+ [License](#license)

## Install

The easiest way to install is via cloning this repository:

```zsh
user@local:~$ git clone https://github.com/mserajnik/hydrusrvue.git
user@local:~$ cd hydrusrvue
user@local:hydrusrvue$ yarn
```

### Dependencies

+ [Node.js][node-js]
+ [Yarn][yarn]

I usually use the latest versions; if there has not been an update to this
repository in a while and something breaks on the latest Node/Yarn version,
please [let me know][issues].

### Updating

If you have installed via cloning the repository, you can update via Git:

```zsh
user@local:hydrusrvue$ git pull
user@local:hydrusrvue$ yarn
```

Always make sure to run `yarn` after updating to install any packages you might
be missing.

hydrusrvue follows [Semantic Versioning][semantic-versioning] and any breaking
changes that require additional attention will be released under a new major
version (e.g., `2.0.0`). Minor version updates (e.g., `1.1.0` or `1.2.0`) are
therefore always safe to simply install via the routine mentioned before.

When necessary, this section will be expanded with upgrade guides to new major
versions.

## Usage

### Configuration

Duplicate `.env.example` as `.env`. Make use of the following options to
configure your installation:

+ `VUE_APP_TITLE=hydrusrvue`: sets the title of your installation. It is used
  throughout the whole application, making it possible to add some personal
  flavor/branding.
+ `VUE_APP_DESCRIPTION=A Vue-based frontend for hydrusrv`: sets the content
  of `<meta name="description">`. Be advised that hydrusrvue is not opmitized
  for search engines and that they might decide to ignore the description even
  if provided.
+ `VUE_APP_ROBOTS=noindex, nofollow`: sets the content of
  `<meta name="robots">`.
+ `VUE_APP_API_URL=https://example.com/api`: the URL to your hydrusrv
  API. __No trailing slashes.__
+ `VUE_APP_REGISTRATION_ENABLED=true`: setting this to `false` disables the
  registration page. This does not disable the registration in your hydrusrv
  installation; to achieve this, use the appropriate hydrusrv setting.
+ `VUE_APP_MIN_PASSWORD_LENGTH=16`: sets the minimum password length when
  registering or updating the password. Providing a higher value than `1024`
  will discard the value and use `1024` as the minimum length instead. This
  is only used for frontend validation and should mirror the setting in
  hydrusrv for the best user experience.
+ `VUE_APP_FALLBACK_FILES_SORTING_NAMESPACE=namespace`: sets the fallback
  sorting namespace that is needed to not break namespace sorting. Should be
  set to something sensible like `creator` or `series`, depending on your
  preferences.
+ `VUE_APP_FALLBACK_TAG_COLOR=#3498db`: sets the default tag color when none
  are configured by the user.

### Develop

```zsh
user@local:hydrusrvue$ yarn serve
```

### Build

```zsh
user@local:hydrusrvue$ yarn build
```

### Deploy

After running `yarn build`, copy the content from `dist` to any webspace.

## Demo

You can find a demo installation at
[https://hydrusrvue.mser.at][hydrusrvue-demo].

Please take note that I am running this installation using
[hydrusrv-docker][hydrusrv-docker] on a small
[Vultr Cloud Compute][vultr-cloud-compute] instance with limited performance,
bandwidth and traffic (meaning the demo could go down until the next month if
the traffic limit gets exceeded).

It contains only safe for work images tagged with `scenery` (take a look at the
[screenshots](#screenshots) for some examples).

Registration is enabled, so feel free to create as many users as you would
like. __Created users are deleted at 12am every day.__

## Screenshots

![Frontpage][screenshot-frontpage]

![Searching files with tags][screenshot-search]

![Files sorting options][screenshot-sorting]

![File detail page][screenshot-detail]

![Searching tags][screenshot-tags]

![Configuring settings][screenshot-settings]

![Changing user data][screenshot-user]

## Donate

If you like hydrusrvue and want to buy me a coffee, feel free to donate via
PayPal:

[![Donate via PayPal][paypal-image]][paypal]

Alternatively, you can also send me BTC:

![Donate BTC][btc-image]  
`13jRyroNn8QF4mbGZxKS6mR3PsxjYTsGsu`

Donations are unnecessary, but very much appreciated. :)

## Maintainer

[mserajnik][maintainer]

## Contribute

You are welcome to help out!

[Open an issue][issues] or submit a pull request.

## License

[MIT](LICENSE.md) © Michael Serajnik

[hydrusrv]: https://github.com/mserajnik/hydrusrv
[vue]: https://vuejs.org/
[hydrus-server]: http://hydrusnetwork.github.io/hydrus
[bulma]: https://bulma.io/
[lazy-loading-routes]: https://router.vuejs.org/guide/advanced/lazy-loading.html
[vue-cli]: https://cli.vuejs.org/
[modern-mode]: https://cli.vuejs.org/guide/browser-compatibility.html#modern-mode
[node-js]: https://nodejs.org/en/
[yarn]: https://yarnpkg.com/
[semantic-versioning]: https://semver.org/
[hydrusrv-docker]: https://github.com/mserajnik/hydrusrv-docker
[hydrusrvue-demo]: https://hydrusrvue.mser.at
[vultr-cloud-compute]: https://www.vultr.com/pricing/

[screenshot-frontpage]: https://github.com/mserajnik/hydrusrvue/raw/master/media/screenshot-frontpage.png
[screenshot-search]: https://github.com/mserajnik/hydrusrvue/raw/master/media/screenshot-search.png
[screenshot-sorting]: https://github.com/mserajnik/hydrusrvue/raw/master/media/screenshot-sorting.png
[screenshot-detail]: https://github.com/mserajnik/hydrusrvue/raw/master/media/screenshot-detail.png
[screenshot-tags]: https://github.com/mserajnik/hydrusrvue/raw/master/media/screenshot-tags.png
[screenshot-settings]: https://github.com/mserajnik/hydrusrvue/raw/master/media/screenshot-settings.png
[screenshot-user]: https://github.com/mserajnik/hydrusrvue/raw/master/media/screenshot-user.png

[paypal]: https://www.paypal.me/mserajnik
[paypal-image]: https://www.paypalobjects.com/webstatic/en_US/i/btn/png/blue-rect-paypal-26px.png
[btc-image]: https://mserajnik.at/external/btc.png

[maintainer]: https://github.com/mserajnik
[issues]: https://github.com/mserajnik/hydrusrvue/issues/new
