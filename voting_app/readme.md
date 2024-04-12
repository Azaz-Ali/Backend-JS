# user Route

#### user can sign up, then login and get token. Using this token user can change password, and get his/her profile.

# Candidate Route

#### if user is admin then he can add candidate details and change details. But admin cannot vote. Admin is responsible for adding candidates. Using AuthMiddleware admin can modify and delete the details the candidate data.

# Voting

#### one user only vote once. Admin not allowed to vote. User can check how many votes have been voted by voters(users) to a particular candidate at what time. User can get candidate lists according to decreasing order of vote count.
