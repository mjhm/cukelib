package util

// A small package with various utilties needed throughout the sample application

import (
	"errors"
	"fmt"
)

//ArrayToString converts a string slice to string format doesn't escape anything, be warned
func ArrayToString(arr []string) string {
	retStr := "["
	arrLength := len(arr)
	for i, val := range arr {
		retStr += val
		if i != arrLength-1 {
			retStr += ","
		}
	}
	retStr += "]"
	return retStr
}

// StringToArray converts a string slice encoded as a string into an native go slice
// Assumes no escapes sequences, errors when it encounters even mildly deviant syntax
// Don't enclose the member strings in quotes
func StringToArray(arrStr string) ([]string, error) {
	var retSlice []string
	if arrStr[0] != '[' || arrStr[len(arrStr)-1] != ']' {
		return retSlice, errors.New("string needs a leading and trailing bracket")
	}
	arrStr = arrStr[1 : len(arrStr)-1]
	curStr := ""
	for _, char := range arrStr {
		if char == ',' {
			retSlice = append(retSlice, curStr)
			curStr = ""
		} else {
			curStr = fmt.Sprintf("%s%c", curStr, char)
		}
	}
	retSlice = append(retSlice, curStr)
	return retSlice, nil
}

func ErrorToString(e error) string {
	return fmt.Sprintf("%v", e)
}
