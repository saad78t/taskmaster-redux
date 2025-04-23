*** Settings ***
Library    SeleniumLibrary
Suite Teardown  Close Browser


*** Test Cases ***
Test Chrome
    Open Browser    https://saad78t.github.io/taskmaster-redux/   Chrome  options=add_argument("--headless"); 
    Maximize Browser Window
    Title Should Be  TaskMaster With Redux
