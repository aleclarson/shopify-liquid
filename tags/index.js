module.exports = function(engine){
    require("./assign")(engine);
    require("./capture")(engine);
    require("./case")(engine);
    require("./comment")(engine);
    require("./cycle")(engine);
    require("./decrement")(engine);
    require("./for")(engine);
    require("./if")(engine);
    require("./increment")(engine);
    require("./raw")(engine);
    require("./tablerow")(engine);
    require("./unless")(engine);
};
