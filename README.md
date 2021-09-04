
# Terminal.js

Terminal.js is a small library that allows you to build a simple terminal. features like commands, working with directories and authorization are already on the work.

#### QnA
`why there isn't much in this project yet ?`
actually, all of the features i've mentioned are actually implemented. this is only the version that i have decided to release for the public, but for me, it is the 3.O version (because yes I have rewritten it and will do it again this time)

`what ? why rewrite twice ? why not release the old versions ?`
because there are a lot of aspects in them that are broken, well, broken since the moment i made them. that's why i had to rewrite it, and now rewrite it once more with all of these problems in mind.

`why is this project so unprofissional ? that isn't what a programmer would make`
because i am still a student in my last year of school, so i don't know how to make things "profissional". also this is exactly why i am releasing this for the public, so i can get feedback and improve my ways more and more.

`I like this project (i hope that you will), but how can i help ?`
It'll mean the world to me if you decided to support me in any way possible, perhaps by a suggestion, an issue, or even some nice words. this is the first time i'd build anything for the public, so i would be really happy to have even the tiniest bit of support for it, in any way or mean possible.

## Installation

for now, you can only use it by downloading this repository and linking the file in the `dist` folder to your project. more work will be done in order to make installation easier soon.

## Usage

```js
// initializing a new terminal interface
let terminal = new Terminal(
  // a terminal must be connected to an html element
  document.querySelector("#terminal"),
  // you can customize your terminal with these attributes
  // there are default styles so no need to customize everything
  {
    color: "red",
    backgroundColor: "gray",
    padding: "1rem",
    // fontSize: 3rem,
    fontFamily: "monospace"
  }
)

// printing something on the screen
// terminal.print(text to be printed, delay)
terminal.print("Hello there !", 500)
```

## Contribution
this is the first project of mine that'd be released on the internet, so even the smallest bits of support will be so appreciated by me. i am not a dedicated programmer since i am in my last year before graduation, but i'll try my best to give it my all to make this project better and better as time marches.

##License

[MIT](LICENSE)