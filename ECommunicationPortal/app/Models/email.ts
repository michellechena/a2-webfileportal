export interface IUserMailboxes {
    MailboxId: number,
    UserMailBoxId: number,
    UserId: number,
    ShortName: string,
    FullName: string,
    IsMainContact: boolean,
    IsDefaultMailbox: boolean,
    StatusId: boolean
}

export interface IUserfolder {
    FolderId: number,
    MailboxId: number,
    FolderName: string,
    TypeId: boolean,
    StatusId: boolean
}

export interface IUserfolderWithDetails {
    UserId: number,
    UsermailboxID: number,
    TotalFolder: number,
    TotalFiles: number,
    DefaultFolder: number,
    UsermailboxList: IUsermailboxList
}
export interface IUsermailboxList {
    MailboxId: number,
    ShortName: string,
    FullName: string,
    StatusId: number,
    UserFolderList: IUserFolderList
}

export interface IUserFolderList {
    FolderId: number,
    MailboxId: number,
    FolderName: string,
    TypeId: number,
    StatusId: number,
    TotalActiveFiles: number,
    TotalDisableFiles: number,   
    UserFileList: IUserFileList
}
export interface IUserFileList {
    FileId: number,
    FolderId: number,
    FilePath: string,
    FileName: string,
    TypeId: number,
    StatusId: number,
    IsValid: boolean   
}

export interface IUserfiles {
    FileId: number,
    FolderId: number,
    FilePath: string,
    FileName: string,
    TypeId: boolean,
    StatusId: boolean,
    IsValid: boolean,
    IsSelect:boolean
}
export interface IUserEmailFolderList {
    FolderId: number,
    MailboxId: number,
    FolderName: string,
    TypeId: number,
    StatusId: number,
    TotalActiveFiles: number,
    TotalDisableFiles: number,
    TotalFiles: number
}

export interface IUserSelectedFiles {
    FileID: number,
    IsChecked:boolean
}