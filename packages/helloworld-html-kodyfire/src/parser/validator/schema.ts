export const page = {
  type: "object",
properties: {
  title: {type: "string"},
  content: {type: "string"},
  template: {enum: ["page1.html.template", "page2.html.template"]}
},
required: ["title"]
}
export const pagesArray = {
  type: "array",
  items: page
}
export const schema = {
    type: "object",
    properties: {
      pages: pagesArray 
    }
  }
