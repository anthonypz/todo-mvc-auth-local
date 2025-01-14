const Company = require("../models/Company")

// @desc    Show add page
// @route   GET /companies/addCompany
exports.showAddPage = (req, res) => {
  res.render("addCompany.ejs")
}

// @desc    Process add form
// @route   POST /companies
exports.createCompany = async (req, res) => {
  console.log("request body:", req.body)
  try {
    const uniqID = await req.user.id
    const company = await Company.create({
      userId: uniqID,
      companyName: req.body.companyName,
      // Added a default date for current date
      dateAdded: req.body.dateAdded || new Date(),
      url: req.body.url,
      role: req.body.role,
      roleURL: req.body.roleURL,
      position: req.body.position,
      source: req.body.source,
      pointOfContact: {
        name: req.body.pocName,
        position: req.body.pocPosition,
        email: req.body.pocEmail,
      },
      application: {
        applied: req.body?.applied === "yes",
        applyDate: req.body.applyDate,
        coffeeChat: req.body?.coffeeChat === "yes",
        coffeeChatDate: req.body.coffeeChatDate,
        saidThanks: req.body?.saidThanks === "yes",
        interviewDate: req.body.interviewDate,
        followUpDate: req.body.followUpDate,
      },
      comments: req.body.comments,
    })
    console.log("Company Data has been added!")
    console.log(company)
    res.redirect("/companies")
  } catch (err) {
    console.log(err)
  }
}

// @desc    Show all companies
// @route   GET /companies
exports.showCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.user.id }).lean()
    // console.log(companies)
    res.render("companies.ejs", {
      companies,
    })
  } catch (err) {
    console.error(err)
    res.render("error/500")
  }
}

// @desc    Show edit page
// @route   GET /companies/edit/:id
exports.showEditPage = async (req, res) => {
  try {
    const company = await Company.findOne({
      _id: req.params.id,
    }).lean()
    if (!company) {
      return res.render("error/404")
    }
    if (company.userId != req.user.id) {
      res.redirect("/companies")
    } else {
      console.log(company)
      res.render("editCompany.ejs", {
        company,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render("error/500")
  }
}

// @desc    Update company
// @route   PUT /companies/:id
exports.updateCompany = async (req, res) => {
  try {
    let company = await Company.findById(req.params.id).lean()
    console.log(company)
    if (!company) {
      return res.render("error/404")
    }
    if (company.userId != req.user.id) {
      res.redirect("/companies")
    } else {
      company = await Company.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      )
      res.redirect("/companies")
    }
  } catch (err) {
    console.error(err)
    return res.render("error/500")
  }
}

// @desc    Delete company
// @route   DELETE /companies/:id
exports.deleteCompany = async (req, res) => {
  try {
    await Company.remove({ _id: req.params.id })
    console.log("Company has been deleted!")
    res.redirect("/companies")
  } catch (err) {
    console.error(err)
    return res.render("error/500")
  }
}
