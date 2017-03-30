var fs = require('fs');

var rules = (
    {IF : "if"},
    {LEFT_PARENT : "\("},
    {RIGHT_PARENT : "\)"},
    {LEFT_BRACE : "\{"},
    {RIGHT_BRACE : "\}"},
    {VAR : "var"},
    {EQUAL : "="},
    {INTEGER : "\d+"},
    {TEXT : "[\w\d$]+"}
);

