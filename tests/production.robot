*** Settings ***
Library    SeleniumLibrary
Suite Teardown  Close Browser


*** Test Cases ***
Test Chrome
    Open Browser    https://saad78t.github.io/taskmaster-redux/   Chrome  options=add_argument("--headless"); 
    Maximize Browser Window
    Title Should Be  TaskMaster With Redux
    Wait Until Element Is Visible    //button[contains(., "Add Task")]    timeout=10s
    Click Button    //button[contains(., "Add Task")]
    Wait Until Element Is Visible    //input[@type='text']    timeout=10s
    Input Text    //input[@type='text']    Test input text
