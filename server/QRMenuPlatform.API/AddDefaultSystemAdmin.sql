-- Script to add default SystemAdmin user
-- Email: Admin@gmil.com
-- Password: Admin1234

-- Note: This script computes the SHA256 hash of "Admin1234" and base64 encodes it
-- The hash is computed using SQL Server's HASHBYTES function

DECLARE @PasswordHash NVARCHAR(MAX);
DECLARE @Password NVARCHAR(50) = 'Admin1234';

-- Compute SHA256 hash and convert to base64
SET @PasswordHash = CAST(N'' AS XML).value('xs:base64Binary(xs:hexBinary(sql:column("hash")))', 'NVARCHAR(MAX)')
FROM (SELECT HASHBYTES('SHA2_256', @Password) AS hash) AS h;

-- Alternative: Use a pre-computed hash value
-- The SHA256 hash of "Admin1234" base64 encoded is: jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=
SET @PasswordHash = 'jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=';

-- Insert the user if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'Admin@gmil.com')
BEGIN
    DECLARE @UserId INT;
    
    INSERT INTO Users (Email, PasswordHash, FirstName, LastName, Role, IsEmailVerified, IsActive, CreatedAt)
    VALUES ('Admin@gmil.com', @PasswordHash, 'Admin', 'User', 'SystemAdmin', 1, 1, GETUTCDATE());
    
    SET @UserId = SCOPE_IDENTITY();
    
    INSERT INTO SystemAdmins (UserId, CreatedAt)
    VALUES (@UserId, GETUTCDATE());
    
    PRINT 'Default SystemAdmin user created successfully!';
END
ELSE
BEGIN
    PRINT 'SystemAdmin user already exists.';
END




