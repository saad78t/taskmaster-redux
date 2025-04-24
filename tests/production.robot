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
    
    # Add a new task
    Select From List By Value   //div[1]/div[2]/select  High
    Select From List By Value   //div[1]/div[3]/select  Personal
    Input Text    //input[@placeholder='Enter task name...']    Task to Edit
    Input Text    //input[@placeholder='Enter task description...']    Task to Edit
    Click Button    //button[contains(., "Add Task")]
    
    Wait Until Element Is Visible    //button[contains(., 'read more')]    timeout=10s
    Element Should Be Enabled    //button[contains(., 'read more')]
    Click Button    //button[contains(., 'read more')]
    Wait Until Page Contains    Task to Edit    timeout=5s
    [Teardown]    Close All Browsers
