# Introduction

**Risloo Profile CLI** is a library for creating profiles for *psychological* tests in SVG and PNG format in Persian.

# Installation

In order to install the package, you can write the code below in your terminal:

```
npm install -g risloo-profile-cli
```

# How Does It Work?

This library is equipped with a CLI in order to create profiles.
The structure of the CLI is as follows:

### Main Structure

```
risloo [command]
```

### Commands

```
draw|D <profileName> [options]
```

### **draw** Command Options

```
-p, --profile-variant <variant>     Variant of the Profile, Choices: {both, raw, with-sidebar}, Default: both
-i, --input-type <type>             Type of Input, Choices: {local, remote, raw-json}, Default: local
-d, --input-data <data>             Input Data
-o, --output-type <type>            Type of Output, Choices: {local, remote}, Default: local
-a, --output-address <address>      Output Address
-m, --measure                       Additional Feature for Measuring Dimensions and Distances, Default: false
-v, --dev                           Dev Mode, Default: false
```

# CLI Status Codes

The **Status Codes** after entering a command for creating a profile is as follows:

| Status Code | Label | Description |
| ----------- | ----- | ----------- |
| 0 | Success | Profile Successfully Created! |
| 1 | Not Found | Input Data File Does Not Exist! |
| 2 | Profile JS Error | Error in Instantiating the Profile Object |
| 3 | Invalid Name | Profile Name Is Not Valid |
| 4 | Not Found | Profile Template File Does Not Exist |

# Naming Variables Stratrgy

This part is of great importance if you are going to develop and change the source code. We tried much to make code neat and clean, hence commented nearly completely, so that you on the role of developer are able to understand the code rationale as soon as possible!!

The *rules* taken into account in the time of creating the variables are:

1. ***items*** is the general term for array of data elements to be drawn inside the profile. An item might contain mark, label, numerical (and maybe non-numerical) values required for drawing (e.g. width, angle, point coordinate, color, opacity and ...).
2. If there is the total data element and it has enough differences from other elements (so-called ***items***), we name it ***raw*** which is an object with properties identical to any element of *items*.
3. If there is any scale or periodic graduation in the profile, we name it ***ticks*** which is an array including objects with tick number, numerical parameter required for drawing (e.g. coordinate, angle, width, height or ...).
4. The ***s*** located at the end of a variable name denotes the array nature of that variable and there is no need for the matter to be emphasized with the suffix ***Arr***.
5. Structure for the Dataset Score: `dataset.score = [{label: {eng, ...others}, mark}]`

